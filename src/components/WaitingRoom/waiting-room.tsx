import React, {useState} from 'react';
import styles from './waiting-room.module.css';

export default function WaitingRoom() {
  // 動的なプレイヤーリストの管理
  const [players, setPlayers] = useState([
    { id: 1, name: 'ルフィ', status: '（船長）', },
    { id: 2, name: 'ウソップ', status: '' },
    { id: 3, name: 'サンジ', status: '' },
    { id: 4, name: 'バギー', status: '' },
    { id: 5, name: 'ロビン', status: '' }
  ]);

  return (
    <div className={styles.all}>
    <div className={styles.container}>
      <h1 className={styles.title}>待機中....</h1>

      {/* ルームIDの表示 */}
      <div className={styles.roomId}>
        <p>ID 12345678</p>
      </div>

      {/* 参加人数の表示 */}
      <div className={styles.playerCount}>現在の参加人数: {players.length}人</div>

      {/* プレイヤーのリスト */}
      <ul className={styles.playerList}>
        {players.map(player => (
          <li key={player.id} className={styles.playerBox}>
            <span className={styles.playerName}>{player.id}. {player.name} {player.status}</span> 
          </li>
        ))}
      </ul>

     {/* ボタングループ */}
      <div className={styles.buttonGroup}>
         {/* 開始ボタン */}
        <button className={styles.startButton}>大富豪を目指していざ出陣！</button>

      {/* 退出ボタン */}
        <button className={styles.exitButton}>退出</button>
      </div>
    </div>
    </div>
  );
}
