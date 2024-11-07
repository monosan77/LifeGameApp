import styles from './gameboard.module.css';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import TaunChangeTelop from './TaunChangeTelop/TaunChangeTelop';
import Roulette from './Roulette/Roulette';
import Image from 'next/image';
import { Members } from '@/types/session';

const PLAYER_ICON = [
  '/game/icon/car-icon1.png',
  '/game/icon/car-icon2.png',
  '/game/icon/car-icon3.png',
  '/game/icon/car-icon4.png',
  '/game/icon/car-icon5.png',
];

interface Prop {
  roomId: string;
  yourInfo: Members;
  member: Members[];
}

export default function Gameboard({ roomId, yourInfo, member }: Prop) {
  const [playerPositions, setPlayerPositions] = useState<number[]>(
    Array(member.length).fill(0)
  ); // 3人のプレイヤーの位置を管理（初期値は全員0）
  const [currentPlayer, setCurrentPlayer] = useState(0); // 現在のプレイヤーを追跡

  const [diceResult, setDiceResult] = useState<number>(0); // ダイスの結果を管理
  const [isRouletteAnimation, setIsRouletteAnimation] = useState(false);
  const [rouletteStyle, setRouletteStyle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const [playersFinished, setPlayersFinished] = useState([]);

  //ルーレットのアニメーションを開始する関数
  function handleRouletteAnimation(dice: number) {
    setRouletteStyle(`number-${dice}`);
  }

  // pusher受信
  useEffect(() => {
    async function getNextPlayer(newPosition: number[]) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/taun-change?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPlayer, newPosition }),
        }
      );
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);

    // ダイスの結果を受信
    channel.bind('result-dice', async function (resultDice: number | null) {
      console.log(resultDice, 'dice');
      if (resultDice) {
        setIsRouletteAnimation(true);
        setDiceResult(resultDice);
        // ルーレットのアニメーション開始
        handleRouletteAnimation(resultDice);

        // ルーレットアニメション終了後の処理
        setTimeout(() => {
          setIsRouletteAnimation(false);
          setRouletteStyle('');

          // プレイヤーの位置を更新
          const newPosition = [...playerPositions];
          for (let i = 1; i <= resultDice; i++) {
            setTimeout(() => {
              newPosition[currentPlayer] = newPosition[currentPlayer] + 1;
              setPlayerPositions([...newPosition]);

              // 現在のプレイヤーと操作プレイヤーを比較し同じであればターンを回すAPIにリクエストを送る
              if (
                i === resultDice &&
                yourInfo.id === member[currentPlayer].id
              ) {
                getNextPlayer(newPosition);
              }
            }, i * 500);
          }
        }, 4000);
      }
    });

    return () => {
      pusher.unsubscribe(`${roomId}`);
      pusher.disconnect();
    };
  }, [currentPlayer, member, playerPositions, roomId, yourInfo.id]);

  const [isTaunChangeAnimation, setIsTaunChangeAnimation] = useState(false);

  //ターンチェンジを受信
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channel = pusher.subscribe(`${roomId}`);
    channel.bind('result-next-player', async function (nextPlayer: number) {
      setCurrentPlayer(nextPlayer);
      setTimeout(() => {
        // ターンチェンジアニメーションの開始
        setIsTaunChangeAnimation(true);
        setTimeout(() => {
          setIsTaunChangeAnimation(false);
        }, 3000);
      }, 500);
    });
    return () => {
      pusher.unsubscribe(`${roomId}`);
      pusher.disconnect();
    };
  }, [currentPlayer, roomId]);

  // ダイスを振る
  const [isErrorAnimation, setIsErrorAnimation] = useState(false);
  async function rollDice() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/dice?roomId=${roomId}`
      );
      if (!res.ok) {
        throw new Error(`Failed to roll dice: ${res.statusText}`);
      }
      setIsErrorAnimation(false);
    } catch {
      if (isErrorAnimation) return;

      setIsErrorAnimation(true);
      setErrorMessage(
        'エラーが発生しました。再度ダイスボタンを押してください。'
      );
      setTimeout(() => {
        setIsErrorAnimation(false);
      }, 5000);
    }
  }

  return (
    <main className={styles.all}>
      <section className={styles.term}>
        {yourInfo.id === member[currentPlayer].id
          ? 'あなた'
          : member[currentPlayer].name}
        のターン
      </section>

      <section className={styles.board}>
        {/* 1行目 */}
        <div className={styles.road1} id="road1"></div>
        <div className={styles.row1}>
          <div className={`${styles.space} ${styles.start}`} id="start">
            START
            {/* プレイヤー1がこの位置にいる場合 */}
            {playerPositions.map(
              (position, index) =>
                position === 0 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-1">
            1
            {playerPositions.map(
              (position, index) =>
                position === 1 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-2">
            2
            {playerPositions.map(
              (position, index) =>
                position === 2 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-3">
            3
            {playerPositions.map(
              (position, index) =>
                position === 3 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-4">
            4
            {playerPositions.map(
              (position, index) =>
                position === 4 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-5">
            5
            {playerPositions.map(
              (position, index) =>
                position === 5 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-6">
            6
            {playerPositions.map(
              (position, index) =>
                position === 6 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-7">
            7
            {playerPositions.map(
              (position, index) =>
                position === 7 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-8">
            8
            {playerPositions.map(
              (position, index) =>
                position === 8 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-9">
            9
            {playerPositions.map(
              (position, index) =>
                position === 9 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 2行目 */}
        <div className={styles.road2} id="road2"></div>
        <div className={styles.row2}>
          <div className={`${styles.space} ${styles.secret}`} id="space-18">
            18
            {playerPositions.map(
              (position, index) =>
                position === 18 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
            <div className={styles.verticalBox1}></div>
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-17">
            17
            {playerPositions.map(
              (position, index) =>
                position === 17 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-16">
            16
            {playerPositions.map(
              (position, index) =>
                position === 16 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-15">
            15
            {playerPositions.map(
              (position, index) =>
                position === 15 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-14">
            14
            {playerPositions.map(
              (position, index) =>
                position === 14 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-13">
            13
            {playerPositions.map(
              (position, index) =>
                position === 13 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-12">
            12
            {playerPositions.map(
              (position, index) =>
                position === 12 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-11">
            11
            {playerPositions.map(
              (position, index) =>
                position === 11 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-10">
            10
            {playerPositions.map(
              (position, index) =>
                position === 10 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* 3行目 */}
        <div className={styles.road3} id="road3"></div>
        <div className={styles.row3}>
          <div className={`${styles.space} ${styles.secret}`} id="space-19">
            19
            {playerPositions.map(
              (position, index) =>
                position === 19 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-20">
            20
            {playerPositions.map(
              (position, index) =>
                position === 20 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-21">
            21
            {playerPositions.map(
              (position, index) =>
                position === 21 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-22">
            22
            {playerPositions.map(
              (position, index) =>
                position === 22 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-23">
            23
            {playerPositions.map(
              (position, index) =>
                position === 23 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-24">
            24
            {playerPositions.map(
              (position, index) =>
                position === 24 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-25">
            25
            {playerPositions.map(
              (position, index) =>
                position === 25 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-26">
            26
            {playerPositions.map(
              (position, index) =>
                position === 26 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-27">
            27
            {playerPositions.map(
              (position, index) =>
                position === 27 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 4行目 */}
        <div className={styles.road4} id="road4"></div>
        <div className={styles.row4}>
          <div className={`${styles.space} ${styles.secret}`} id="space-38">
            38
            {playerPositions.map(
              (position, index) =>
                position === 38 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-37">
            37
            {playerPositions.map(
              (position, index) =>
                position === 37 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-36">
            36
            {playerPositions.map(
              (position, index) =>
                position === 36 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-35">
            35
            {playerPositions.map(
              (position, index) =>
                position === 35 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-34">
            34
            {playerPositions.map(
              (position, index) =>
                position === 34 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-33">
            33
            {playerPositions.map(
              (position, index) =>
                position === 33 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-33">
            32
            {playerPositions.map(
              (position, index) =>
                position === 32 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-31">
            31
            {playerPositions.map(
              (position, index) =>
                position === 31 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-30">
            30
            {playerPositions.map(
              (position, index) =>
                position === 30 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-29">
            29
            {playerPositions.map(
              (position, index) =>
                position === 29 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-28">
            28
            {playerPositions.map(
              (position, index) =>
                position === 28 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* 5行目 */}
        <div className={styles.road5} id="road5"></div>
        <div className={styles.row5}>
          <div className={`${styles.space} ${styles.plus}`} id="space-39">
            39
            {playerPositions.map(
              (position, index) =>
                position === 39 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
            <div className={styles.verticalBox2}></div>
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-40">
            40
            {playerPositions.map(
              (position, index) =>
                position === 40 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-41">
            41
            {playerPositions.map(
              (position, index) =>
                position === 41 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-42">
            42
            {playerPositions.map(
              (position, index) =>
                position === 42 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-43">
            43
            {playerPositions.map(
              (position, index) =>
                position === 43 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-44">
            44
            {playerPositions.map(
              (position, index) =>
                position === 44 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-45">
            45
            {playerPositions.map(
              (position, index) =>
                position === 45 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-46">
            46
            {playerPositions.map(
              (position, index) =>
                position === 46 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-47">
            47
            {playerPositions.map(
              (position, index) =>
                position === 47 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-48">
            48
            {playerPositions.map(
              (position, index) =>
                position === 48 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 6行目 */}
        <div className={`${styles.road6}`} id="road6"></div>
        <div className={styles.row6}>
          <div className={`${styles.space} ${styles.goal}`} id="goal">
            GOAL
            {playerPositions.map(
              (position, index) =>
                position === 51 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-50">
            50
            {playerPositions.map(
              (position, index) =>
                position === 50 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-49">
            49
            {playerPositions.map(
              (position, index) =>
                position === 49 && (
                  <div key={index} className={styles.carIcon}>
                    <Image
                      src={PLAYER_ICON[index]}
                      width={80}
                      height={80}
                      alt="アイコン"
                    />
                  </div>
                )
            )}
          </div>
        </div>

        <div
          className={
            isErrorAnimation
              ? styles.onErrorContainer
              : styles.offErrorContainer
          }
        >
          <h3 className={styles.message}>{errorMessage}</h3>
        </div>
      </section>

      <section className={styles.bottomBar}>
        <button className={styles.chat}>chat</button>
        <div className={styles.usersTable}>
          <div className={styles.userBox}>
            <div className={styles.money}>money</div>
            <div className={styles.userName}>user1</div>
          </div>
          <div className={styles.userBox}>
            <div className={styles.money}>money</div>
            <div className={styles.userName}>user2</div>
          </div>
          <div className={styles.userBox}>
            <div className={styles.money}>money</div>
            <div className={styles.userName}>user3</div>
          </div>
          <div className={styles.userBox}>
            <div className={styles.money}>money</div>
            <div className={styles.userName}>user4</div>
          </div>
          <div className={styles.userBox}>
            <div className={styles.money}>money</div>
            <div className={styles.userName}>user5</div>
          </div>
        </div>

        <button
          className={styles.dice}
          onClick={
            yourInfo.id === member[currentPlayer].id ? rollDice : undefined
          }
        >
          dice
        </button>
        {diceResult && (
          <div className={styles.diceResult}>Dice: {diceResult}</div>
        )}
      </section>
      <TaunChangeTelop
        isTaunChangeAnimation={isTaunChangeAnimation}
        yourInfo={yourInfo}
        member={member}
        currentPlayer={currentPlayer}
      />

      <Roulette
        isRouletteAnimation={isRouletteAnimation}
        rouletteStyle={rouletteStyle}
      />

      {/* 一旦保留：ゴールしたプレイヤーを表示 */}
      {/* {playersFinished.length > 0 && (
        <section className={styles.results}>
          <h2>ゴールしたプレイヤー</h2>
          <ul>
            {playersFinished.map((player, index) => (
              <li key={player}>
                プレイヤー{player + 1} - 順位: {index + 1}
              </li>
            ))}
          </ul>
        </section>
      )} */}
    </main>
  );
}
