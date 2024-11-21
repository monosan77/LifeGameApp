import styles from './gameboard.module.css';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import TaunChangeTelop from './TaunChangeTelop/TaunChangeTelop';
import Roulette from './Roulette/Roulette';
import { Members } from '@/types/session';
import TurnDisplay from './TurnDisplay/TurnDisplay';
import Board from './Board/Board';
import BottomBar from './BottomBar/BottomBar';
import Image from 'next/image';
import CountUp from 'react-countup';

interface Prop {
  roomId: string;
  yourInfo: Members;
  member: Members[];
}
interface EventGetPusher {
  eventInfo: Event_Mold;
  moneys: number[];
}

export default function Gameboard({ roomId, yourInfo, member }: Prop) {
  const [playerPositions, setPlayerPositions] = useState<number[]>(
    Array(member.length).fill(0)
  ); // 3人のプレイヤーの位置を管理（初期値は全員0）
  const [currentPlayer, setCurrentPlayer] = useState(0); // 現在のプレイヤーを追跡
  const [diceResult, setDiceResult] = useState<number>(0); // ダイスの結果を管理
  const [moneys, setMoneys] = useState(Array(member.length).fill(0));
  const [eventDetails, setEventDetails] = useState<Event_Mold | null>(null);
  const [isRouletteAnimation, setIsRouletteAnimation] = useState(false);
  const [isEventPop, setIsEventPop] = useState(false);
  const [isCountUpPop, setIsCountUpPop] = useState(false);
  const [isCountUpAnimation, setIsCountUpAnimation] = useState(false);
  const [rouletteStyle, setRouletteStyle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const [playersFinished, setPlayersFinished] = useState([]);

  //ルーレットのアニメーションを開始する関数
  function handleRouletteAnimation(dice: number) {
    setRouletteStyle(`number-${dice}`);
  }

  // pusher受信
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);

    // ダイスの結果を受信
    channel.bind('result-dice', async function (resultDice: number | null) {
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
                setTimeout(() => {
                  handleEvent(
                    newPosition[currentPlayer],
                    currentPlayer,
                    moneys
                  );
                }, 500);
              }
            }, i * 500);
          }
        }, 4000);
      }
    });

    // イベント情報を受信
    channel.bind('get-event-info', (event: EventGetPusher) => {
      setEventDetails(event.eventInfo);
      setMoneys(event.moneys);
      setIsEventPop(true);
    });

    // 次のプレイヤー情報を受信
    channel.bind('result-next-player', async function (nextPlayer: number) {
      setIsEventPop(false);
      setIsCountUpPop(true);

      setTimeout(() => {
        setIsCountUpAnimation(true);

        setTimeout(() => {
          // ターンチェンジアニメーションの開始
          setIsCountUpPop(false);
          setTimeout(() => {
            setCurrentPlayer(nextPlayer);
            setIsTaunChangeAnimation(true);

            setTimeout(() => {
              setIsTaunChangeAnimation(false);
              setIsCountUpAnimation(false);
            }, 3000);
          }, 350);
        }, 2500);
      }, 800);
    });

    return () => {
      pusher.unsubscribe(`${roomId}`);
      pusher.disconnect();
    };
  }, [moneys, currentPlayer, diceResult, eventDetails]);

  async function handleEvent(
    eventId: number,
    currentPlayer: number,
    moneys: number[]
  ) {
    const res = await fetch(`/api/game/get-event?roomId=${roomId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, currentPlayer, moneys }),
    });
    const data = await res.json();
  }
  const [isTaunChangeAnimation, setIsTaunChangeAnimation] = useState(false);
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
      <TurnDisplay
        yourInfo={yourInfo}
        member={member}
        currentPlayer={currentPlayer}
      />

      <Board
        playerPositions={playerPositions}
        isErrorAnimation={isErrorAnimation}
        errorMessage={errorMessage}
      />

      <BottomBar
        yourInfo={yourInfo}
        member={member}
        moneys={moneys}
        currentPlayer={currentPlayer}
        rollDice={rollDice}
        diceResult={diceResult}
        eventDetails={eventDetails}
      />

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

      <div className={isEventPop ? styles.popUp : styles.noPopUp}>
        <div className={styles.eventPopUp}>
          <h1 className={styles.title}>{eventDetails?.event.title}</h1>
          <Image
            src={'/game/event/event1.png'}
            alt="イベント画像"
            width={500}
            height={300}
            className={styles.image}
          />
          <p className={styles.text}>
            {eventDetails?.event.overview}
            <br />
            {eventDetails?.event.value}万円
            {eventDetails?.event.event_type === 'plus' ? 'もらう' : '払う'}
          </p>
          <button
            className={styles.button}
            onClick={() => getNextPlayer(playerPositions)}
          >
            OK
          </button>
        </div>
      </div>
      <div className={isCountUpPop ? styles.popUp : styles.noPopUp}>
        <div className={styles.countUpPop}>
          {eventDetails && (
            <h1>
              {isCountUpAnimation ? (
                <CountUp
                  // start={moneys[currentPlayer] - eventDetails.event.value}
                  start={
                    eventDetails.event.event_type === 'plus'
                      ? moneys[currentPlayer] - eventDetails.event.value
                      : moneys[currentPlayer] + eventDetails.event.value
                  }
                  end={moneys[currentPlayer]}
                  duration={2}
                />
              ) : eventDetails.event.event_type === 'plus' ? (
                moneys[currentPlayer] - eventDetails.event.value
              ) : (
                moneys[currentPlayer] + eventDetails.event.value
              )}{' '}
              万円
            </h1>
          )}
          {/* <h1>1000万円</h1> */}
        </div>
      </div>

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
