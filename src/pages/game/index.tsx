/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import WaitingRoom from '@/components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';
import Pusher from 'pusher-js';
import Gameboard from '@/components/Gameboard/gameboard';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { EVENTS } from '../../../data/event';
import { Event_Mold } from '@/types/game';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  roomData: RoomInfo;
  yourInfo: Members;
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
    const roomResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${roomId}`
    );

    const firstEvent: Event_Mold = EVENTS[0];

    if (!roomResponse.ok || !firstEvent) {
      throw new Error('ルーム情報の取得に失敗しました。');
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
        roomData,
        yourInfo: roomData.member.find((player) => player.id === userId)!,
        firstEvent,
      },
    };
  } catch {
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
  roomData,
  yourInfo,
  firstEvent,
}) => {
  const [currentPlayers, setCurrentPlayers] = useState(players);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const syncRoomInfo = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/pusher/wait-room-pusher?roomId=${roomId}`
      );
      const data = await response.json();
      if (data.message === 'ルームが存在しません。') {
        setErrorMessage('ルームが存在しないためトップページへ戻ります。');

        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
      if (!response.ok) {
        throw new Error('ルーム同期に失敗しました');
      }
    } catch {
      setErrorMessage(
        'ルーム情報の同期に失敗しました。ページをリロードしてください。'
      );
    }
  }, [roomId, router]);

  // ブラウザの戻るボタンを押したときにホストの場合はルームを削除する関数

  useEffect(() => {
    async function deleteRoomData() {
      await fetch(`/api/session/deleteRoom?roomId=${roomId}`, {
        method: 'DELETE',
      });
    }
    async function deleteMember() {
      await fetch(`/api/session/deleteMember?roomId=${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yourInfo, roomData }),
      });
    }
    const handlePopState = async () => {
      // alert('ホストがページから離れたため、ルームが削除されます。');
      if (yourInfo.host) {
        await deleteRoomData();
      } else if (!yourInfo.host) {
        await deleteMember();
        await syncRoomInfo();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      if (yourInfo.host) {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [roomData, roomId, syncRoomInfo, yourInfo, yourInfo.host]);

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

  useEffect(() => {
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
      // pusher.unsubscribe(roomId);
      pusher.disconnect();
    };
  }, [roomId, router, syncRoomInfo]);

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
      className={`${styles.container} ${isFadingOut ? styles.fadeOut : styles.fadeIn}`}
    >
      <WaitingRoom
        players={currentPlayers}
        roomId={roomId}
        roomInfo={roomData}
        yourInfo={yourInfo}
        startGame={startGame}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default WaitingRoomPage;
