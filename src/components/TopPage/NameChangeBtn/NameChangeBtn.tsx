import React from 'react';
import styles from './NameChangeBtn.module.css';
import { Yuji_Syuku } from 'next/font/google';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});
interface Prop {
  handleOpen: () => void;
  showLinks: boolean;
}
const NameChangeBtn = ({ handleOpen, showLinks }: Prop) => {
  return (
    <div className={showLinks ? styles.createRoom : styles.noCreateRoom}>
      <button onClick={handleOpen} className={styles.linkContent}>
        <p className={yuji_Syuku.className}>名前を変える</p>
      </button>
    </div>
  );
};
export default NameChangeBtn;
