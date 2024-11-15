import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import WaitingRoom from '../../components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';
import Pusher from 'pusher-js';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
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

    if (!roomResponse.ok) {
      throw new Error('ルーム情報の取得に失敗しました。');
    }

    const roomData: RoomInfo = await roomResponse.json();

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
      },
    };
  } catch (error) {
    console.error('認証エラー:', error);
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
}) => {
  const [currentPlayers, setCurrentPlayers] = useState(players);

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
        console.log('ルーム情報が同期されました：', data.message);
      } catch (error) {
        console.error('同期エラー：', error);
        alert('ルーム情報の同期に失敗しました。ページをリロードしてください。');
      }
    };

    syncRoomInfo();

    // Pusherを使用して、リアルタイムでルーム情報を受け取る
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(roomId);

    // channel.bind('joinRoom', (data: { member: Members[] }) => {
    channel.bind('joinRoom', (data: any) => {
      console.log('Received data:', data);
      setCurrentPlayers(data.member);
    });

    return () => {
      pusher.unsubscribe(roomId);
    };
  }, [roomId]);

  return (
    <div>
      <WaitingRoom players={currentPlayers} roomId={roomId} />
    </div>
  );
};

export default WaitingRoomPage;
