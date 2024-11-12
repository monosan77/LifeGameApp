import React from 'react';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import WaitingRoom from '../../components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';

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
  return (
    <div>
      <WaitingRoom players={players} roomId={roomId} />
    </div>
  );
};

export default WaitingRoomPage;
