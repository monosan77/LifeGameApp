import styles from './gameboard.module.css';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import TaunChangeTelop from './TaunChangeTelop/TaunChangeTelop';
import Roulette from './Roulette/Roulette';
import { Members } from '@/types/session';
import TurnDisplay from './TurnDisplay/TurnDisplay';
import Board from './Board/Board';
import BottomBar from './BottomBar/BottomBar';
import EventPopUp from './EventPopUp/EventPopUp';
import RescueEventPopUp from './RescueEventPopUp/RescueEventPopUp';
import CountUpPop from './CountUpPop/CountUpPop';

interface Prop {
  roomId: string;
  yourInfo: Members;
  member: Members[];
  firstEventData: Event_Mold;
}
interface EventGetPusher {
  eventInfo: Event_Mold;
  beforeMoney: number[];
  newMoney: number[];
}

export default function Gameboard({
  roomId,
  yourInfo,
  member,
  firstEventData,
}: Prop) {
  const [playerPositions, setPlayerPositions] = useState<number[]>(
    Array(member.length).fill(0)
  ); // 3人のプレイヤーの位置を管理（初期値は全員0）
  const [currentPlayer, setCurrentPlayer] = useState(0); // 現在のプレイヤーを追跡
  const [diceResult, setDiceResult] = useState<number>(0); // ダイスの結果を管理
  const [moneys, setMoneys] = useState(Array(member.length).fill(-300)); //所持金
  const [beforeMoney, setBeforeMoney] = useState(Array(member.length).fill(0)); //所持金の増減前の金額を格納
  const [eventDetails, setEventDetails] = useState<Event_Mold>(firstEventData); //マスごとのイベントを格納
  const [errorMessage, setErrorMessage] = useState<string>(''); //エラーメッセージ

  // アニメーション開始フラグ
  const [isRouletteAnimation, setIsRouletteAnimation] = useState(false);
  const [rouletteStyle, setRouletteStyle] = useState(''); //ルーレットのスタイル
  const [isEventPop, setIsEventPop] = useState(false);
  const [isCountUpPop, setIsCountUpPop] = useState(false);
  const [isCountUpAnimation, setIsCountUpAnimation] = useState(false);
  const [isActiveTurn, setIsActiveTurn] = useState(false);
  const [isRescueEventPop, setIsRescueEventPop] = useState(false);
  const [isTaunChangeAnimation, setIsTaunChangeAnimation] = useState(false);
  const [isTachDiceBtn, setIsTachDiceBtn] = useState(true);

  // const [playersFinished, setPlayersFinished] = useState([]);

  //ルーレットのアニメーションを開始する関数
  function handleRouletteAnimation(dice: number) {
    setRouletteStyle(`number-${dice}`);
  }

  // 画面読み込み時に一度だけ動作するイベントアニメションの開始
  useEffect(() => {
    setTimeout(() => {
      setIsEventPop(true);
    }, 500);
  }, []);

  // pusher受信
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);

    // ダイスの結果を受信
    channel.bind('result-dice', async function (resultDice: number | null) {
      if (resultDice) {
        // popUpを初期化
        if (isEventPop || isRescueEventPop) {
          setIsEventPop(false);
          setIsRescueEventPop(false);
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
            const data = await getSpecialEvent(resultDice);
            setBeforeMoney(data.beforeMoney);
            setMoneys(data.newMoney);
            // setMoneys(newMoney);
            if (yourInfo.id === member[currentPlayer].id) {
              return getNextPlayer(playerPositions, data.newMoney);
            }
          } else {
            setIsActiveTurn(true);
            // プレイヤーの位置を更新
            const newPosition = [...playerPositions];

            // 一マスずつ駒を移動する処理
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

    return () => {
      pusher.disconnect();
    };
  }, [
    roomId,
    currentPlayer,
    playerPositions,
    moneys,
    isEventPop,
    isActiveTurn,
    yourInfo.id,
    member[currentPlayer]?.id,
  ]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);

    // 救済イベントを受信
    channel.bind('rescue-event', (event: Event_Mold) => {
      setEventDetails(event);
      setTimeout(() => {
        setIsRescueEventPop(true);
      }, 500);
    });

    return () => {
      channel.unbind('rescue-event');
      pusher.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);
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
      pusher.disconnect();
    };
  }, [moneys, roomId]);

  // Pusherのイベントを受信
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);
    // 次のプレイヤー情報を受信
    channel.bind('result-next-player', (eventData: any) => {
      setPlayerPositions(eventData.newPosition);
      setMoneys(eventData.newMoney);
      setIsEventPop(false);
      setIsCountUpPop(true);

      setTimeout(() => {
        setIsCountUpAnimation(true);

        setTimeout(() => {
          // ターンチェンジアニメーションの開始
          setIsCountUpPop(false);
          setTimeout(() => {
            setCurrentPlayer(eventData.nextPlayer);
            setIsTaunChangeAnimation(true);

            setTimeout(() => {
              // ターンチェンジ終了時アニメーションを初期化
              setIsTaunChangeAnimation(false);
              setIsCountUpAnimation(false);
              setIsActiveTurn(false);
              setIsTachDiceBtn(true);
            }, 3000);
          }, 350);
        }, 2500);
      }, 800);
    });

    return () => {
      pusher.unsubscribe(roomId);
      pusher.disconnect();
    };
  }, [roomId]);

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

  async function getNextPlayer(newPosition: number[], newMoney: number[]) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/taun-change?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPlayer, newPosition, newMoney }),
        }
      );
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  // ダイスボタンを押したとき実行される
  function pushDiceBtn() {
    setIsTachDiceBtn(false);
    setIsActiveTurn(false);
    rollDice();

    // ダイスボタンを押した後ルーレットアニメーションが動かない場合再度ボタンを押せるようにする
    setTimeout(() => {
      if (!isRouletteAnimation) {
        setIsTachDiceBtn(true);
      }
    }, 2000);
  }
  // イベントPopUpのOkを押したとき実行される。
  async function eventIgnition() {
    if (eventDetails) {
      if (eventDetails.event.event_type === 'special') {
        if (moneys[currentPlayer] <= 0) {
          setIsEventPop(false);
          const rescueEvent: Event_Mold = { ...eventDetails };

          rescueEvent.event.special_event = {
            id: '000',
            conditions: ['1-2', '3-6'],
            effect_type: '*/',
            effect_value: [0, 1],
            base_amount: [0, 1],
          };
          const res = await fetch(`api/game/rescue-event?roomId=${roomId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rescueEvent }),
          });
          const data = await res.json();
        } else {
          rollDice();
        }
      } else {
        getNextPlayer(playerPositions, moneys);
      }
    }
  }
  // 救済イベントのOk押したとき実行される
  function eventRescueBtn() {
    setIsRescueEventPop(false);
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
        isTachDiceBtn={isTachDiceBtn}
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

      <EventPopUp
        isEventPop={isEventPop}
        eventDetails={eventDetails}
        member={member}
        currentPlayer={currentPlayer}
        yourInfo={yourInfo}
        eventIgnition={eventIgnition}
      />
      <RescueEventPopUp
        isRescueEventPop={isRescueEventPop}
        eventDetails={eventDetails}
        member={member}
        currentPlayer={currentPlayer}
        yourInfo={yourInfo}
        eventRescueBtn={eventRescueBtn}
      />

      <CountUpPop
        isCountUpPop={isCountUpPop}
        eventDetails={eventDetails}
        isCountUpAnimation={isCountUpAnimation}
        beforeMoney={beforeMoney}
        moneys={moneys}
        currentPlayer={currentPlayer}
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
