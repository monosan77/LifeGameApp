import React from 'react';
import styles from './TurnDisplay.module.css';
import { Members } from '@/types/session';

interface Props {
  yourInfo: Members;
  member: Members[];
  currentPlayer: number;
}

const TurnDisplay = ({ yourInfo, member, currentPlayer }: Props) => {
  return (
    <section className={styles.term}>
      {member.length > 0 && member.length > currentPlayer
        ? yourInfo.id === member[currentPlayer].id
          ? 'あなた'
          : member[currentPlayer].name
        : '不明'}
      のターン
    </section>
  );
};

export default TurnDisplay;
