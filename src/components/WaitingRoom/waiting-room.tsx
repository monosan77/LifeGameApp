import React from 'react';
import styles from './waiting-room.module.css';
import { Members } from '@/types/session';

interface WaitingRoomPageProps{
  players:Members[];
  roomId:number;
}

export default function WaitingRoom({ players, roomId }:WaitingRoomPageProps) {
  return (
    <div className={styles.all}>
      <div className={styles.container}>
        <h1 className={styles.title}>待機中....</h1>

        {/* ルームIDの表示 */}
        <div className={styles.roomId}>
          <p>ID {roomId}</p>
        </div>

        {/* 参加人数の表示 */}
        <div className={styles.playerCount}>現在の参加人数: {players.length}人</div>

        {/* プレイヤーのリスト */}
        <ul className={styles.playerList}>
          {players.map(player => (
            <li key={player.id} className={styles.playerBox}>
              <span className={styles.playerName}>{player.id}. {player.name} {player.host ? '（ホスト）' : ''}</span>
            </li>
          ))}
        </ul>

        {/* ボタングループ */}
        <div className={styles.buttonGroup}>
          <button className={styles.startButton}>
            大富豪を目指していざ出陣！
          </button>
          <button className={styles.exitButton}>退出</button>
        </div>
      </div>
    </div>
  );
}
