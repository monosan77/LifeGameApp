import styles from './user-name.module.css';

interface UserNameProps {
  name: string;
}

export default function UserName({ name }: UserNameProps) {
  return <p className={styles.userName}>{`${name}さん、ようこそ！`}</p>;
}
