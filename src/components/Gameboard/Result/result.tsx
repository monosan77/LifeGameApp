import ConfettiComponent from '@/components/Confetti/confetti';
import styles from './result.module.css';
import { Members } from '@/types/session';
import Link from 'next/link';

interface resultProps {
  moneys: number[];
  member: Members[];
  roomId: string;
}

interface resultArrayProps {
  user: string;
  sum: number;
  rank?: number;
}

const Result = ({ moneys, member, roomId }: resultProps) => {
  const resultData: resultArrayProps[] = member.map((player, index) => ({
    user: player.name,
    sum: moneys[index],
  }));

  const resultArray = resultData.sort((a, b) => b.sum - a.sum);

  let rank = 1;
  resultArray.forEach((player, index, arr) => {
    if (index > 0 && player.sum === arr[index - 1].sum) {
      player.rank = arr[index - 1].rank;
    } else {
      player.rank = rank;
    }
    rank++;
  });

  const finishHandler = async () => {
    try {
      const res = await fetch('/api/game/finish', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) {
        console.error('roomの削除に失敗しました。', await res.json());
      }
    } catch (error) {
      console.error('roomの削除時にエラーが発生しました。', error);
    }
  };

  return (
    <div className={styles.resultPage}>
      <ConfettiComponent />
      <div className={styles.finishContents}>
        <p>ゲーム終了！</p>
      </div>
      <div className={styles.textWrapper}>
        <span>結</span>
        <span>果</span>
        <span>発</span>
        <span>表</span>
      </div>

      <div className={styles.rank}>
        {resultArray.map((players, index) => (
          <dl
            key={index + 1}
            className={
              players.rank === 1
                ? styles.firstPlace
                : players.rank === 2
                  ? styles.secondPlace
                  : styles.otherPlace
            }
          >
            <dt>
              {players.rank}位：{players.user}さん
            </dt>
            <dd>{players.sum}万円</dd>
          </dl>
        ))}
      </div>
      <Link href="../" className={styles.returnTop}>
        <button onClick={finishHandler}>TOP</button>
      </Link>
    </div>
  );
};

export default Result;
