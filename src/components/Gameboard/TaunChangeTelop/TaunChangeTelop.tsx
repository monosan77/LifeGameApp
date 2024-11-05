import React from 'react';
import styles from './TaunChangeTelop.module.css';
import { Members } from '@/types/session';

interface Prop {
  isTaunChangeAnimation: boolean;
  yourInfo: Members;
  member: Members[];
  currentPlayer: number;
}

const TaunChangeTelop = ({
  isTaunChangeAnimation,
  yourInfo,
  member,
  currentPlayer,
}: Prop) => {
  return (
    <div
      className={
        isTaunChangeAnimation ? styles.nextTaunPop : styles.offNextTaunPop
      }
    >
      <h2
        className={isTaunChangeAnimation ? styles.taunText : styles.offTaunText}
      >
        {yourInfo.id === member[currentPlayer].id
          ? 'あなた'
          : member[currentPlayer].name}
        のターンです！！
      </h2>
    </div>
  );
};

export default TaunChangeTelop;
