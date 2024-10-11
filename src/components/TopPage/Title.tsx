
import { Yuji_Syuku } from 'next/font/google';
import styles from './title.module.css'; 

const yuji_Syuku = Yuji_Syuku({
    subsets: ['latin'],
    weight: ['400'],
});

const Title = () => {
    return (
    <div className={styles.title}>
        <p className={yuji_Syuku.className}>
        <span>人</span>
        <span>生</span>
        <span>ゲ</span>
        <span>ー</span>
        <span>ム</span>
        </p>
    </div>
    );
};

export default Title;
