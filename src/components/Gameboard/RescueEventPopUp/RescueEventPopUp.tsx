import Image from 'next/image';
import React from 'react';
import styles from './RescueEventPopUp.module.css';
import { Members } from '@/types/session';
import { Event_Mold } from '@/types/game';

interface Props {
  isRescueEventPop: boolean;
  eventDetails: Event_Mold;
  member: Members[];
  currentPlayer: number;
  yourInfo: Members;
  eventRescueBtn: () => void;
}

const RescueEventPopUp = ({
  isRescueEventPop,
  eventDetails,
  member,
  currentPlayer,
  yourInfo,
  eventRescueBtn,
}: Props) => {
  return (
    <div className={isRescueEventPop ? styles.popUp : styles.noPopUp}>
      <div
        className={eventDetails ? styles[eventDetails.event.event_type] : ''}
      >
        <h1 className={styles.title}>救済チャレンジ</h1>

        <div className={styles.image}>
          <Image
            src={`/game/event/event-rescue.png`}
            alt="イベント画像"
            fill
            sizes="(max-width: 768px) 100%, 300px"
          />
        </div>
        <p className={styles.text}>
          あなたは借金を抱えている可哀そうな人間なのですね。惨めで汚らしいあなたに救済のチャンスを与えましょう。ダイスを振り、1~2が出れば借金をチャラにする。
        </p>
        <button
          style={
            member[currentPlayer].id === yourInfo.id
              ? { display: 'block' }
              : { display: 'none' }
          }
          className={styles.button}
          onClick={eventRescueBtn}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RescueEventPopUp;
