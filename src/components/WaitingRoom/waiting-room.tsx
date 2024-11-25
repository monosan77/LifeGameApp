import React, { useState } from 'react';
import styles from './waiting-room.module.css';
import { Members } from '@/types/session';
import { useRouter } from 'next/router';

interface WaitingRoomPageProps {
  players: Members[];
  roomId: string;
  yourInfo: Members;
  onExit: () => void;
  startGame: () => void;
}

export default function WaitingRoom({
  players,
  roomId,
  yourInfo,
  onExit,
  startGame,
}: WaitingRoomPageProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const exitRoom = async () => {
    try {
      const response = await fetch(`/api/session/exit?roomId=${roomId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          userId: yourInfo.id, // セッションストレージなどから取得したユーザーIDを使用
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('退出処理に失敗しました');
      }

      // 成功したら、waiting-roomからルーム情報を再取得
      const roomResponse = await fetch(
        `/api/session/get-room-info?roomId=${roomId}`
      );
      const roomData = await roomResponse.json();

      if (!roomResponse.ok) {
        throw new Error('ルーム情報の取得に失敗しました');
      }

      // 新しいプレイヤーリストに更新
      router.push(`/waiting-room?roomId=${roomId}`); // ルーム情報更新後に再レンダリング
    } catch (error) {
      setErrorMessage('退出エラー: サーバーに問題が発生しました');
    }
  };

  return (
    <div className={styles.all}>
      <div className={styles.container}>
        <h1 className={styles.title}>待機中....</h1>

        {/* エラーメッセージの表示 */}
        {errorMessage && (
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
