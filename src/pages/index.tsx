// src/pages/index.tsx
import Head from 'next/head';
import styles from './toppage.module.css';
import Video from '@/components/TopPage/video';
import Title from '@/components/TopPage/Title';
import PageLinks from '@/components/TopPage/pageLink';

export default function Home() {
  return (
    <>
      <Head>
        <meta name="description" content="This is life of game Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topPage_contents}>
        <Video />
        <div className={styles.component}>
          <Title />
          <PageLinks />
        </div>
      </div>
    </>
  );
}
