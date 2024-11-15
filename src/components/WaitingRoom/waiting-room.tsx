import React, { useEffect } from 'react';
import styles from './waiting-room.module.css';
import { Members } from '@/types/session';
import { useRouter } from 'next/router';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
}

export default function WaitingRoom({ players, roomId }: WaitingRoomPageProps) {
  const router = useRouter();

  useEffect(() => {
    if (!players || players.length === 0) {
      console.log('ルーム情報が取得できなかったため、トップページに戻ります。');
      router.push('/');
    }
  }, [players, router]);

  const isHost = players.some((player) => player.host);

  const startGame = async () => {
    try {
      if (isHost) {
        const response = await fetch(`/api/game/start-game?roomId=${roomId}`);
        if (!response.ok) {
          throw new Error('ゲーム開始に失敗しました');
        }
        console.log('ゲーム開始リクエストを送信しました');
      } else {
        console.log('ホストのみがゲームを開始できます');
      }
    } catch (error) {
      console.error('ゲーム開始エラー:', error);
    }
  };

  return (
    <div className={styles.all}>
      <div className={styles.container}>
        <h1 className={styles.title}>待機中....</h1>

        {/* ルームIDの表示 */}
        <div className={styles.roomId}>
          <p>ID {roomId}</p>
        </div>

        {/* 参加人数の表示 */}
        <div className={styles.playerCount}>
          現在の参加人数: {players.length}人
        </div>

        {/* プレイヤーのリスト */}
        <ul className={styles.playerList}>
          {players.map((player) => (
            <li key={player.id} className={styles.playerBox}>
              <span className={styles.playerName}>
                {player.name} {player.host ? '（ホスト）' : ''}
              </span>
            </li>
          ))}
        </ul>

        {/* ボタングループ */}
        <div className={styles.buttonGroup}>
          <button onClick={startGame} className={styles.startButton}>
            大富豪を目指していざ出陣！
          </button>
          <button className={styles.exitButton}>退出</button>
        </div>
      </div>
    </div>
  );
}
