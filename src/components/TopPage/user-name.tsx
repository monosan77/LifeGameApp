import styles from './user-name.module.css';

interface UserNameProps {
  playerName: string;
}

export default function UserName({ playerName}: UserNameProps) {
  return <p className={styles.userName}>{`${playerName}さん、ようこそ！`}</p>;
}
