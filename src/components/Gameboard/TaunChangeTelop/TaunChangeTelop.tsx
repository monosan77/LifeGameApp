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
  // ターンの名前表記の三項演算子の処理
  const isValidPlayer = currentPlayer >= 0 && currentPlayer < member.length;
  const isYourTurn = isValidPlayer && yourInfo.id === member[currentPlayer].id;
  const currentPlayerName = isValidPlayer
    ? isYourTurn
      ? 'あなたのターンです！！'
      : member[currentPlayer].name + 'のターンです！！'
    : '不明なターンです';
  return (
    <div
      className={
        isTaunChangeAnimation ? styles.nextTaunPop : styles.offNextTaunPop
      }
    >
      <h2
        className={isTaunChangeAnimation ? styles.taunText : styles.offTaunText}
      >
        {currentPlayerName}
      </h2>
    </div>
  );
};

export default TaunChangeTelop;
