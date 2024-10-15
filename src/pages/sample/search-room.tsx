import React, { ChangeEvent, FormEvent, useState } from 'react';
import { RoomInfo } from './game-page';
import { useRouter } from 'next/router';

const SearchRoom = () => {
  const router = useRouter();
  const [searchId, setSearchId] = useState<string>('975296');
  const [playerName, setPlayerName] = useState<string>('');
  const [errFlag, setErrFlag] = useState(false);
  const [room, setRoom] = useState<RoomInfo | undefined>();

  async function handleRoomSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setErrFlag(false);
      const res = await fetch(
        `http://localhost:3000/api/session-room?roomId=${searchId}`
      );
      if (!res.ok) {
        return;
      }
      const roomInfo: RoomInfo = await res.json();
      setErrFlag(true);
      setRoom(roomInfo);
    } catch (error) {
      console.log(error);
      setErrFlag(true);
    }
  }

  async function handleGameJoin() {
    // PATCHリクエストを送って部分的に更新する
    const res = await fetch('http://localhost:3000/api/session-room', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName, roomInfo: room }),
    });
    if (!res.ok) {
      alert('すでに満室のルームです。');
      return;
    }
    const playerId = await res.json();
    const yourInfo = { id: playerId, name: playerName, host: false };
    sessionStorage.setItem('playerInfo', JSON.stringify(yourInfo));
    router.push(`http://localhost:3000/sample/game-page?roomId=${room?.id}`);
  }
  return (
    <div>
      <form onSubmit={handleRoomSearch}>
        <div>
          <label htmlFor="playerName">プレイヤー名</label>
          <input
            type="text"
            name="playerName"
            value={playerName}
            maxLength={10}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlayerName(e.target.value)
            }
          />
        </div>
        <div>
          <label htmlFor="search">ルーム検索</label>
          <input
            type="text"
            value={searchId}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchId(e.target.value)
            }
          />
        </div>
        <button type="submit">検索</button>
      </form>
      <div>
        {errFlag ? (
          <div>
            <h1>{room?.member[0].name}のルーム</h1>
            <p>roomID:{room?.id}</p>
            <p>プレイ人数{room?.limitPlayer}人まで</p>
            <button type="button" onClick={handleGameJoin}>
              参加する
            </button>
          </div>
        ) : (
          'ルームを探してください'
        )}
      </div>
    </div>
  );
};

export default SearchRoom;
