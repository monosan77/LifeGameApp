import { useRouter } from 'next/router';
import styles from './create-popup.module.css';
import ShowError from './showError';
import { useState } from 'react';

interface Props {
  closeChanger: () => void;
  createPop: boolean;
  playerName: string;
}

export default function CreatePopup({
  closeChanger,
  createPop,
  playerName,
}: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlayerSelect = async (count: number) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrorMessage('ルームを作成しています');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limitPlayer: count, playerName }),
        }
      );

      if (!response.ok) throw new Error('ルーム作成に失敗しました。');

      const data = await response.json();
      const { roomId, yourId } = data;

      // セッションストレージに保存
      const userInfo = {
        userId: yourId,
        name: playerName,
        host: 'true',
      };

      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

      setLoading(true);
      // 画面遷移
      router.push(`/game?roomId=${roomId}&userId=${yourId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      data-testid="popClass1"
      className={createPop ? styles.visibl : styles.hidde}
    >
      <div
        data-testid="popClass2"
        className={createPop ? styles.createPop : styles.createNoPop}
      >
        <div className={styles.friendPop}>
          <div className={styles.close}>
            <button onClick={closeChanger}>X</button>
          </div>
          <p>何人と遊ぶ？</p>
          <div className={styles.number}>
            {[2, 3, 4, 5].map((count) => (
              <button key={count} onClick={() => handlePlayerSelect(count)}>
                {count}人
              </button>
            ))}
          </div>
          {errorMessage && (
            <ShowError
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
