import React, { useEffect, useState } from 'react';
import styles from './waiting-room.module.css';
import { Members, RoomInfo } from '@/types/session';
import { useRouter } from 'next/router';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  yourInfo: Members;
  roomInfo: RoomInfo;
  startGame: () => void;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function WaitingRoom({
  players,
  roomId,
  yourInfo,
  roomInfo,
  startGame,
  errorMessage,
  setErrorMessage,
}: WaitingRoomPageProps) {
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // 退出処理
  const handleExit = async () => {
    try {
      const response = await fetch(`/api/session/exit?roomId=${roomId}`, {
        method: 'DELETE',
        body: JSON.stringify({ playerInfo: yourInfo, roomInfo }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('退出に失敗しました');
      }

      const res = await fetch(`/api/pusher/wait-room-pusher?roomId=${roomId}`);
      const data = await res.json();

      router.push('/');
    } catch (error) {
      setErrorMessage('退出処理に失敗しました');
    }
  };

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
          <button className={styles.exitButton} onClick={handleExit}>
            退出
          </button>
        </div>
      </div>
    </div>
  );
}
