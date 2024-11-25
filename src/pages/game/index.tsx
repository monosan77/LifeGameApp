import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import WaitingRoom from '../../components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';
import Pusher from 'pusher-js';
import Gameboard from '@/components/Gameboard/gameboard';
import styles from './index.module.css';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  yourInfo: Members; // `yourInfo`プロパティも定義して渡す
  firstEvent: Event_Mold;
}

export const getServerSideProps: GetServerSideProps<
  WaitingRoomPageProps
> = async (context: GetServerSidePropsContext) => {
  const { roomId, userId } = context.query;

  if (!roomId || Array.isArray(roomId) || !userId || Array.isArray(userId)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    // ルーム情報の取得
    const roomResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${roomId}`
    );
    const eventRes = await fetch(`${process.env.API_BACK_URL}/event_table/0`);

    if (!roomResponse.ok || !eventRes.ok) {
      throw new Error('ルーム情報の取得に失敗しました。');
    }

    const roomData: RoomInfo = await roomResponse.json();
    const firstEvent: Event_Mold = await eventRes.json();

    // `member`配列の中に`userId`が存在するか確認
    const isUserInRoom = roomData.member.some((member) => member.id === userId);

    if (!isUserInRoom) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        players: roomData.member,
        roomId: roomData.id,
        yourInfo: roomData.member.find((player) => player.id === userId)!, // `yourInfo`を設定
        firstEvent,
      },
    };
  } catch (error) {
    // console.error('認証エラー:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

const WaitingRoomPage: React.FC<WaitingRoomPageProps> = ({
  players,
  roomId,
  yourInfo,
  firstEvent,
}) => {
  const [currentPlayers, setCurrentPlayers] = useState(players);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // roomIdをクエリパラメータに含めてfetchリクエストを送信
    const syncRoomInfo = async () => {
      try {
        const response = await fetch(
          `/api/pusher/wait-room-pusher?roomId=${roomId}`
        );
        if (!response.ok) {
          throw new Error('ルーム同期に失敗しました。');
        }
        const data = await response.json();
      } catch (error) {
        setErrorMessage(
          'ルーム情報の同期に失敗しました。ページをリロードしてください。'
        );
      }
    };

    syncRoomInfo();

    // Pusherを使用して、リアルタイムでルーム情報を受け取る
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(roomId);

    channel.bind('joinRoom', (roomInfo: RoomInfo) => {
      setCurrentPlayers(roomInfo.member);
    });

    channel.bind('start-game', () => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsFadingOut(false);
        setGameStarted(true);
      }, 1000);
    });

    return () => {
      pusher.unsubscribe(roomId);
      pusher.disconnect();
    };
  }, [roomId]);

  if (gameStarted) {
    return (
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <Gameboard
          roomId={roomId}
          yourInfo={yourInfo}
          member={currentPlayers}
          firstEventData={firstEvent}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${
        isFadingOut ? styles.fadeOut : styles.fadeIn
      }`}
    >
      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
      )}
      <WaitingRoom
        players={currentPlayers}
        roomId={roomId}
        yourInfo={yourInfo}
      />
    </div>
  );
};

export default WaitingRoomPage;
