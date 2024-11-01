import { useState } from 'react';
import { useRouter } from 'next/router';
import CreatePopup from './Create_Popup_Button/create-popup';
import styles from './create-button.module.css';
import { Yuji_Syuku } from 'next/font/google';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

interface CreateButtonProps {
  playerName: string;
}

export default function CreateButton({ playerName }: CreateButtonProps) {
  const [createPop, setCreatePop] = useState(false);
  const router = useRouter();

  const createChanger = () => {
    setCreatePop(!createPop);
  };

  const handlePlayerSelect = async (count: number, name: string) => {
    setCreatePop(false); // ポップアップを閉じる

    console.log('選択された人数:', count);
    console.log('プレイヤー名:', playerName);

  try {
    const response = await fetch('http://localhost:3000/api/session/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limitPlayer: count, playerName: name }),
    });

    if (!response.ok) throw new Error('ルーム作成に失敗しました。');

    const data = await response.json();
    
    console.log('APIレスポンス:', data); 

    const { roomId, userId } = data;

    // セッションストレージに保存
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('name', playerName);
    sessionStorage.setItem('host', 'true');

    // 画面遷移
    router.push(`/game?roomId=${roomId}`);
  } catch (error) {
    console.error('エラー:', error);
    alert('ルーム作成に失敗しました。');
  }
};

  return (
    <>
      <CreatePopup 
      closeChanger={createChanger} 
      createPop={createPop} 
      onSelectPlayers={handlePlayerSelect} 
      playerName={playerName}
      />
      <div className={styles.createRoom}>
        <button onClick={createChanger} className={styles.linkContent}>
        <p className={yuji_Syuku.className}>
            ルームを
            <br />
            つくる</p>
        </button>
      </div>
    </>
  );
}
