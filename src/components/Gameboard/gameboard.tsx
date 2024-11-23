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
  beforeMoney: number[];
  newMoney: number[];
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
  const [isActiveTurn, setIsActiveTurn] = useState(false);
  const [rouletteStyle, setRouletteStyle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [beforeMoney, setBeforeMoney] = useState(Array(member.length).fill(0));
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
      console.log(resultDice, '受け取ったダイス結果');
      if (resultDice) {
        if (isEventPop) {
          setIsEventPop(false);
        }
        setIsRouletteAnimation(true);
        setDiceResult(resultDice);
        // ルーレットのアニメーション開始
        handleRouletteAnimation(resultDice);

        // ルーレットアニメション終了後の処理
        setTimeout(async () => {
          setIsRouletteAnimation(false);
          setRouletteStyle('');
          if (isActiveTurn) {
            console.log('特殊イベント');
            // const newMoney: number[] = await getSpecialEvent(resultDice);
            const data = await getSpecialEvent(resultDice);
            console.log(data, '新しい金額');
            setBeforeMoney(data.beforeMoney);
            setMoneys(data.newMoney);
            // setMoneys(newMoney);
            if (yourInfo.id === member[currentPlayer].id) {
              console.log(playerPositions, 'postion');

              return getNextPlayer(playerPositions);
            }
          } else {
            console.log('駒動かすよ');
            setIsActiveTurn(true);
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
                    handleGETEvent(
                      newPosition[currentPlayer],
                      currentPlayer,
                      moneys
                    );
                  }, 500);
                }
              }, i * 500);
            }
          }
        }, 4000);
      }
    });

    // 通常イベント情報を受信
    channel.bind('get-event-info', (event: EventGetPusher) => {
      setEventDetails(event.eventInfo);
      if (moneys !== event.newMoney) {
        setMoneys(event.newMoney);
        setBeforeMoney(event.beforeMoney);
      }
      setIsEventPop(true);
    });

    return () => {
      // pusher.unsubscribe(`${roomId}`);
      pusher.disconnect();
    };
  }, [
    roomId,
    diceResult,
    currentPlayer,
    playerPositions,
    moneys,
    isEventPop,
    isActiveTurn,
  ]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);
    // 次のプレイヤー情報を受信
    channel.bind('result-next-player', (nextPlayer: number) => {
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
              setIsActiveTurn(false);
            }, 3000);
          }, 350);
        }, 2500);
      }, 800);
    });
    return () => {
      // pusher.unsubscribe(`${roomId}`);
      pusher.disconnect();
    };
  }, [
    roomId,
    // currentPlayer,
    // playerPositions,
    // moneys,
    // isEventPop,
    // isActiveTurn,
  ]);

  async function getSpecialEvent(diceResult: number) {
    try {
      const res = await fetch(
        `/api/game/special-event?diceResult=${diceResult}`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            eventDetails,
            moneys,
            currentPlayer,
          }),
        }
      );
      const data = await res.json();
      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async function handleGETEvent(
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

  function eventIgnition() {
    if (eventDetails) {
      if (eventDetails.event.event_type === 'special') {
        rollDice();
        // setIsEventPop(false);
      } else {
        getNextPlayer(playerPositions);
      }
    }
  }

  async function getNextPlayer(newPosition: number[]) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/taun-change?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPlayer, newPosition }),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  // ダイスボタンを押したとき実行される
  function pushDiceBtn() {
    setIsActiveTurn(false);
    rollDice();
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

  console.log(beforeMoney, 'now');
  console.log(moneys, 'new');
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
        pushDiceBtn={pushDiceBtn}
        diceResult={diceResult}
        // eventDetails={eventDetails}
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
        <div
          className={eventDetails ? styles[eventDetails.event.event_type] : ''}
        >
          <h1 className={styles.title}>{eventDetails?.event.title}</h1>
          <Image
            src={'/game/event/event1.png'}
            alt="イベント画像"
            width={500}
            height={300}
            className={styles.image}
          />
          <p className={styles.text}>{eventDetails?.event.overview}</p>
          <button
            style={
              member[currentPlayer].id === yourInfo.id
                ? { display: 'block' }
                : { display: 'none' }
            }
            className={styles.button}
            onClick={() => eventIgnition()}
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
                  start={beforeMoney[currentPlayer]}
                  end={moneys[currentPlayer]}
                  duration={2}
                />
              ) : (
                beforeMoney[currentPlayer]
              )}{' '}
              万円
            </h1>
          )}
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
