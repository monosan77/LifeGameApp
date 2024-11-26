import ConfettiComponent from '@/components/Confetti/confetti';
import styles from './result.module.css';
import { Members } from '@/types/session';
import Link from 'next/link';
import Image from 'next/image';

interface resultProps {
  moneys: number[];
  member: Members[];
}

const Result = ({ moneys, member }: resultProps) => {
  const resultData = member.map((player, index) => ({
    user: player.name,
    sum: moneys[index],
  }));

  const resultArray = resultData.sort((a, b) => b.sum - a.sum);

  console.log(resultArray);

  return (
    <div className={styles.resultPage}>
      <ConfettiComponent />
      <div className={styles.textWrapper}>
        {/* <span>〜</span> */}
        <span>結</span>
        <span>果</span>
        <span>発</span>
        <span>表</span>
        {/* <span>〜</span> */}
      </div>

      <div className={styles.rank}>
        {resultArray.map((players, index) => (
          <dl
            key={index + 1}
            className={
              index === 0
                ? styles.firstPlace
                : index === 1
                  ? styles.secondPlace
                  : styles.otherPlace
            }
          >
            <dt>
              {index + 1}位：{players.user}さん
            </dt>
            <dd>{players.sum}万円</dd>
          </dl>
        ))}
      </div>
      <Link href="../" className={styles.returnTop}>
        <button>Top</button>
      </Link>
    </div>
  );
};

export default Result;
