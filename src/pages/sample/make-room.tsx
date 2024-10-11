import { useRouter } from 'next/router';
import React, { useState } from 'react';

const MakeRoom = () => {
  const router = useRouter();
  const [player, setPlayer] = useState(2);

  console.log(player);
  async function makeRoom() {
    const res = await fetch('/api/make-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(player),
    });
    if (!res.ok) {
      return alert('ルーム作成に失敗しました。再度作り直してください');
    }
    const data = await res.json();
    alert('ルーム作成完了しました。待機画面へ移動ます。');
    router.push(`/sample/game-page?roomId=${data}`);
  }
  return (
    <div>
      <label htmlFor="player">人数選択</label>
      <select
        name="player"
        value={player}
        id="player"
        onChange={(e: any) => setPlayer(e.target.value)}
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
