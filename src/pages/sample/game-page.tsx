import { Members, RoomInfo } from '@/types/session';
import { sharePlayers } from '@/utils/fetch-functions';
import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import WaitingRoom from './waiting-room';
import Gameboard from '@/components/Gameboard/gameboard';

interface Props {
  roomInfo: RoomInfo;
}
interface Query {
  roomId: string;
}
export async function getServerSideProps({ query }: { query: Query }) {
  const { roomId }: { roomId: string | null } = query;

  try {
    if (!roomId) {
      throw new Error('ルームが存在しません。');
    }
    const res = await fetch(
      `http://localhost:3000/api/session/get-room-info?roomId=${roomId}`
    );
    if (!res.ok) {
      throw new Error('ルームが存在しません。');
    }
    const roomInfo = await res.json();
    return {
      props: {
        roomInfo,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/sample/make-room',
        permanent: false,
      },
    };
  }
}

const GamePage = ({ roomInfo }: Props) => {
  const router = useRouter();
  const [yourInfo, setYourInfo] = useState<Members>({
    id: '',
    name: '',
    host: false,
  });
  const [member, setMember] = useState<Members[]>(roomInfo.member);
  const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
  const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

  useEffect(() => {
    const getSessionStorage = sessionStorage.getItem('playerInfo');
    if (!getSessionStorage) {
      alert('ルームに参加できません');
      router.push('/sample/search-room');
      return;
    }
    const getYourInfo: Members = JSON.parse(getSessionStorage);

    // roomのDBに登録ないプレイヤーの入室を禁止する処理
    let checkPlayer = false;
    for (const player of roomInfo.member) {
      if (player.id === getYourInfo.id) {
        checkPlayer = true;
      }
    }
    if (!checkPlayer) {
      alert('ルームに参加できません');
      router.push('/sample/search-room');
    }
    if (getYourInfo) {
      setYourInfo(getYourInfo);
    }
    // 参加プレイヤーをほかユーザに共有
    sharePlayers(roomInfo.id);
  }, [roomInfo.id, roomInfo.member, router]);

  // リアルタイム通信（受信）
  useEffect(() => {
    const pusher = new Pusher(KEY, {
      cluster: CLUSTER,
    });
    const channel = pusher.subscribe(`${roomInfo.id}`);

    // 入室時の同期を受信
    channel.bind('joinRoom', async function (roominfo: RoomInfo | null) {
      if (!roominfo) {
        alert('ルームが存在しません');
        return router.push('/sample/make-room');
      }
      setMember(roominfo.member);
    });
    channel.bind('start-game', async function (isStart: boolean | null) {
      if (isStart) {
        setIsStartGame(true);
      }
    });

    // ゲーム開始を受信

    return () => {
      pusher.unsubscribe(`${roomInfo.id}`);
      pusher.disconnect();
    };
  }, [CLUSTER, KEY, roomInfo.id, router]);

  // ゲーム開始処理
  const [isStartGame, setIsStartGame] = useState(false);
  async function handleGamePlay() {
    const res = await fetch(
      `http://localhost:3000/api/game/start-game?roomId=${roomInfo.id}`
    );
    if (res.ok) {
      // setIsStartGame(true);
    }
    const data = await res.json();

    console.log(data);
  }

  return (
    <>
      {isStartGame ? (
        <Gameboard roomId={roomInfo.id} yourInfo={yourInfo} member={member} />
      ) : (
        <WaitingRoom
          roomInfo={roomInfo}
          yourInfo={yourInfo}
          member={member}
          handleGamePlay={handleGamePlay}
        />
      )}
    </>
  );
};

export default GamePage;
