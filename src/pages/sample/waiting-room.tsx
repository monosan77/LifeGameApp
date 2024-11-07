import { sharePlayers } from '@/utils/fetch-functions';
import { useRouter } from 'next/router';
import React from 'react';

const WaitingRoom = ({ roomInfo, yourInfo, member, handleGamePlay }: any) => {
  const router = useRouter();
  async function handleLeaveRoom() {
    const SessionStorage = sessionStorage.getItem('playerInfo');
    const playerInfo = SessionStorage ? JSON.parse(SessionStorage) : null;

    const res = await fetch(
      `http://localhost:3000/api/session/exit?roomId=${roomInfo.id}`,
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
          : member.map((member: any, index: any) => (
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
        <button type="button" onClick={handleGamePlay}>
          ゲームを始める
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
