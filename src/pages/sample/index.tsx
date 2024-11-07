import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const GameRoom = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [events, setEvents] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channel = pusher.subscribe('game-channel');
    channel.bind('player-joined', (data: { player: string }) => {
      setPlayers((prev) => [...prev, data.player]);
    });

    channel.bind('dice-rolled', (data: { event: string }) => {
      setEvents((prev) => [...prev, data.event]);
      // 現在のプレイヤーを更新
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    });

    return () => {
      channel.unbind();
      channel.unsubscribe();
    };
  }, [players]);

  const createRoom = () => {
    const playerName = prompt('プレイヤー名を入力してください');
    if (playerName) {
      setPlayers((prev) => [...prev, playerName]);
      setGameStarted(true);

      // プレイヤー参加イベントをサーバーに送信
      fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'player-joined',
          data: { player: playerName },
        }),
      });
    }
  };

  const rollDice = () => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const eventMessage = `${players[currentPlayerIndex]} が ${diceValue} を振った！`;

    fetch('/api/pusher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'dice-rolled',
        data: { event: eventMessage },
      }),
    });
  };

  return (
    <div>
      <h1>人生ゲーム</h1>
      <button onClick={createRoom}>ルームを作成</button>
      {gameStarted && (
        <>
          <h2>現在のプレイヤー: {players[currentPlayerIndex]}</h2>
          <button onClick={rollDice}>サイコロを振る</button>
          <h3>イベント:</h3>
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GameRoom;
