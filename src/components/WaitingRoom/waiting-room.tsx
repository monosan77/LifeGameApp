import React, { useEffect, useState } from 'react';
import styles from './waiting-room.module.css';
import { Members } from '@/types/session';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  yourInfo: Members;
  onExit: () => void;
  startGame: () => void;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function WaitingRoom({
  players,
  roomId,
  yourInfo,
  onExit,
  startGame,
  errorMessage,
  setErrorMessage,
}: WaitingRoomPageProps) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className={styles.all}>
      <div className={styles.container}>
        <h1 className={styles.title}>待機中....</h1>

        {/* エラーメッセージの表示 */}
        {showError && errorMessage && (
          <div className={styles.errorBox}>
            <p>{errorMessage}</p>
          </div>
        )}

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
          <button className={styles.exitButton} onClick={onExit}>
            退出
          </button>
        </div>
      </div>
    </div>
  );
}
