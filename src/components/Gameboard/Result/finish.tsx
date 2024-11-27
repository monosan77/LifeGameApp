import { useState } from 'react';
import styles from './finish.module.css';
import Result from './result';
import { Members } from '@/types/session';

interface resultProps {
  moneys: number[];
  member: Members[];
}

const Finish = ({ moneys, member }: resultProps) => {
  const [isResult, setIsResult] = useState(true);

  function resultClickHandler() {
    setIsResult(false);
  }
  return (
    <div className={styles.finishedPopup}>
      <div
        className={
          isResult === true ? styles.finishContents : styles.notFinishContents
        }
      >
        <p>ゲーム終了！</p>
        <button onClick={resultClickHandler}>結果を見る</button>
      </div>
      {!isResult && <Result moneys={moneys} member={member} />}
    </div>
  );
};

export default Finish;
