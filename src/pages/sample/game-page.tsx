import { sharePlayers } from '@/utils/sharePlayers';
import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

export interface RoomInfo {
  id: number;
  limitPlayer: number;
  member: Members[];
}
export interface Members {
  id: string;
  name: string;
  host: boolean;
}
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
      `http://localhost:3000/api/session-room?roomId=${roomId}`
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
        destination: '/sample/make-room', // リダイレクト先のパス
        permanent: false, // permanent: true の場合、ステータスコード 308 でリダイレクト。false だと307。
      },
    };
  }
}

const GamePage = ({ roomInfo }: Props) => {
  const router = useRouter();
  const [yourInfo, setYourInfo] = useState<Members | null>();
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
    channel.bind('joinRoom', async function (roominfo: RoomInfo | null) {
      if (!roominfo) {
        alert('ルームが存在しません');
        return router.push('/sample/make-room');
      }
      setMember(roominfo.member);
      console.log('受信完了', roominfo);
    });

    return () => {
      pusher.unsubscribe(`${roomInfo.id}`);
    };
  }, [CLUSTER, KEY, roomInfo.id, router]);

  // 退室処理
  async function handleLeaveRoom() {
    const SessionStorage = sessionStorage.getItem('playerInfo');
    const playerInfo = SessionStorage ? JSON.parse(SessionStorage) : null;

    const res = await fetch(
      `http://localhost:3000/api/session-room?roomId=${roomInfo.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerInfo }),
      }
    );
    if (res.ok) {
      alert('roomを退室しました。');
      // 参加プレイヤーをほかユーザに共有

      sharePlayers(roomInfo.id);

      return router.push('/sample/search-room');
    }
    alert('退室できませんでした。再度お試しください。');
  }

  return (
    <div>
      <h1>ルームID：{roomInfo.id}</h1>
      <h4>
        あなたは {yourInfo?.name} さんです
        {yourInfo?.host ? '(あなたがホストです)' : ''}
      </h4>
      <h2>参加プレイヤー</h2>
      <ul>
        {!member
          ? ''
          : member.map((member, index) => (
              <li key={index}>
                {member.name}
                {member.host ? '(ホスト)' : ''}
              </li>
            ))}
      </ul>
      <div>
        <button type="button" onClick={handleLeaveRoom}>
          退室する
        </button>
      </div>
    </div>
  );
};

export default GamePage;
