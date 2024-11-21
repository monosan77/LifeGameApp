import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>人生ゲーム!!一発逆転のチャンスを掴め!!～</title>
        <meta name="description" content="This is life of game Application" />
        <link rel="icon" href="/icon/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
