import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';

const MakeRoom = () => {
  const router = useRouter();
  const [limitPlayer, setLimitPlayer] = useState(2);
  const [playerName, setPlayerName] = useState<string>('');

  async function makeRoom() {
    if (!playerName || playerName.length === 0) {
      alert('名前を入力して');
      return;
    }
    const res = await fetch('/api/session-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limitPlayer, playerName }),
    });
    if (!res.ok) {
      return alert('ルーム作成に失敗しました。再度作り直してください');
    }
    const { roomId, yourId } = await res.json();
    const yourInfo = { id: yourId, name: playerName, host: true };
    sessionStorage.setItem('playerInfo', JSON.stringify(yourInfo));
    alert('ルーム作成完了しました。待機画面へ移動ます。');
    router.push(`/sample/game-page?roomId=${roomId}`);
  }
  return (
    <div>
      <label htmlFor="name">プレイヤー名</label>
      <input
        type="text"
        value={playerName}
        placeholder="プレイヤー名を入力してください"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPlayerName(e.target.value)
        }
        maxLength={10}
      />
      <label htmlFor="player">人数選択</label>

      <select
        name="limitPlayer"
        value={limitPlayer}
        id="limitPlayer"
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setLimitPlayer(Number(e.target.value))
        }
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button type="button" onClick={makeRoom}>
        ルームを作る
      </button>
    </div>
  );
};

export default MakeRoom;
