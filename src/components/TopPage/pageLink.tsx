// src/components/TopPage/PageLinks.tsx
import Link from 'next/link';
import styles from './pageLink.module.css';
import { Yuji_Syuku } from 'next/font/google';
import { useState, useEffect } from 'react';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

export default function PageLinks() {
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLinks(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.pageLink} ${showLinks ? styles.visible : ''}`}>
      <Link href="#">
        <div className={styles.linkContent}>
          <p className={yuji_Syuku.className}>
            ルームを
            <br />
            つくる
          </p>
        </div>
      </Link>
      <Link href="#">
        <div className={styles.linkContent}>
          <p className={yuji_Syuku.className}>
            ルームを
            <br />
            さがす
          </p>
        </div>
      </Link>
    </div>
  );
}
