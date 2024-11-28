import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import WaitingRoom from '@/components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';
import Pusher from 'pusher-js';
import Gameboard from '@/components/Gameboard/gameboard';
import styles from './index.module.css';
import { useRouter } from 'next/router';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  yourInfo: Members;
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
    const roomResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${roomId}`
    );

    if (!roomResponse.ok) {
      throw new Error('ルーム情報の取得に失敗しました');
    }

    const roomData: RoomInfo = await roomResponse.json();

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
        yourInfo: roomData.member.find((player) => player.id === userId)!,
      },
    };
  } catch (error) {
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
}) => {
  const [currentPlayers, setCurrentPlayers] = useState(players);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const startGame = async () => {
    if (!yourInfo.host) {
      setErrorMessage('ホストのみゲームを開始できます');
      return;
    }
    try {
      const response = await fetch(`/api/game/start-game?roomId=${roomId}`);

      if (!response.ok) {
        setErrorMessage('ゲームの開始に失敗しました');
        return;
      }

      setIsFadingOut(true);
      setTimeout(() => {
        setIsFadingOut(false);
        setGameStarted(true);
      }, 1000);
    } catch (error: any) {
      setErrorMessage(error.message || 'ゲーム開始処理に失敗しました');
    }
  };

  // 退出処理
  const handleExit = async () => {
    try {
      const response = await fetch(`/api/session/exit?roomId=${roomId}`, {
        method: 'DELETE',
        body: JSON.stringify({ playerInfo: yourInfo }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('退出に失敗しました');
      }

      const res = await fetch(`/api/pusher/wait-room-pusher?roomId=${roomId}`);
      const data = await res.json();

      router.push('/');
    } catch (error) {
      setErrorMessage('退出処理に失敗しました');
    }
  };

  useEffect(() => {
    const syncRoomInfo = async () => {
      try {
        const response = await fetch(
          `/api/pusher/wait-room-pusher?roomId=${roomId}`
        );
        if (!response.ok) {
          throw new Error('ルーム同期に失敗しました');
        }
        const data = await response.json();
      } catch (error) {
        setErrorMessage(
          'ルーム情報の同期に失敗しました。ページをリロードしてください。'
        );
      }
    };

    syncRoomInfo();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(roomId);

    channel.bind('room-deleted', (data: any) => {
      setErrorMessage(data.message);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    });

    channel.bind('joinRoom', (data: any) => {
      setCurrentPlayers(data.member);
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
    };
  }, [roomId, router]);

  if (gameStarted) {
    return (
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <Gameboard roomId={roomId} yourInfo={yourInfo} member={players} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${isFadingOut ? styles.fadeOut : styles.fadeIn}`}
    >
      <WaitingRoom
        players={currentPlayers}
        roomId={roomId}
        yourInfo={yourInfo}
        onExit={handleExit}
        startGame={startGame}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default WaitingRoomPage;
