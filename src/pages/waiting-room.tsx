import React from 'react';
import WaitingRoom from '../components/WaitingRoom/waiting-room';
import { Members, RoomInfo } from '@/types/session';
import { GetServerSidePropsContext } from 'next';


interface WaitingRoomPageProps {
  players: Members[];
  roomId: number;
}


export async function getServerSideProps(context:GetServerSidePropsContext) {
  console.log(context);
  const { id } = context.query;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${id}`
    );

    if (!response.ok) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const data: RoomInfo = await response.json();

    return {
      props: {
        players: data.member,
        roomId: data.id,
      },
    };
    
  } catch (error) {
    console.error('データ取得エラー:', error);
    return {
      props: {
        players: [],
        roomId: '',
      },
    };
  }
}

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
