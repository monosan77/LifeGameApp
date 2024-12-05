import styles from './gameboard.module.css';
import React, { useCallback, useEffect, useState } from 'react';
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
import Result from './Result/result';
import { Event_Mold } from '@/types/game';
import Chat from '../Chat/Chat';

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

interface MessageProps {
  name: string;
  message: string;
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
  const [moneys, setMoneys] = useState(Array(member.length).fill(300)); //所持金
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

  //result画面
  const [isResult, setIsResult] = useState(false);

  //chat画面
  const [isChat, setIsChat] = useState(false);
  const [chatMessageArray, setChatMessageArray] = useState<MessageProps[]>([]);

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
      pusher.unsubscribe(roomId);

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
      pusher.unsubscribe(roomId);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('result-next-player', (eventData: any) => {
      if (eventData.nextPlayer === -1) {
        setIsResult(true);
        setIsEventPop(false);
      } else {
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
      }
    });

    return () => {
      pusher.unsubscribe(roomId);
      pusher.disconnect();
    };
  }, [roomId]);
  const getSpecialEvent = useCallback(
    async (diceResult: number) => {
      try {
        const res = await fetch(
          `/api/game/special-event?diceResult=${diceResult}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventDetails,
              moneys,
              currentPlayer,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        return null; // エラー時にはnullを返す
      }
    },
    [eventDetails, moneys, currentPlayer] // 必要な依存関係を指定
  );

  const handleGETEvent = useCallback(
    async (eventId: number, currentPlayer: number, moneys: number[]) => {
      try {
        const res = await fetch(`/api/game/get-event?roomId=${roomId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId, currentPlayer, moneys }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data; // 必要に応じて戻り値を使う
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        return null; // エラー時には null を返す
      }
    },
    [roomId] // 必要な依存関係を指定
  );

  const getNextPlayer = useCallback(
    async (newPosition: number[], newMoney: number[]) => {
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

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Next player data:', data);
        return data; // 必要に応じてデータを利用
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        return null;
      }
    },
    [roomId, currentPlayer] // 必要な依存関係を指定
  );

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
          await fetch(`api/game/rescue-event?roomId=${roomId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rescueEvent }),
          });
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

  // pusher受信
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(`${roomId}`);

    // ダイスの結果を受信
    channel.bind('result-dice', async function (resultDice: number) {
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

            if (newPosition[currentPlayer] + resultDice > 50) {
              resultDice = 51 - newPosition[currentPlayer];
            }

            // 一マスずつ駒を移動する処理
            for (let i = 1; i <= resultDice; i++) {
              setTimeout(() => {
                newPosition[currentPlayer] = newPosition[currentPlayer] + 1;

                setPlayerPositions([...newPosition]);

                if (
                  i === resultDice &&
                  yourInfo.id === member[currentPlayer].id
                  // yourInfo.id === member[currentPlayer].id && newPosition[currentPlayer] !>50
                ) {
                  // console.log('呼び出された')
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
      pusher.unsubscribe(roomId);
    };
  }, [
    roomId,
    currentPlayer,
    playerPositions,
    moneys,
    isEventPop,
    isActiveTurn,
    yourInfo.id,
    isRescueEventPop,
    getSpecialEvent,
    member,
    getNextPlayer,
    handleGETEvent,
  ]);

  useEffect(() => {
    //pusherクライアントの初期化
    //特定のPusherアプリケーションを識別するためのユニークなID
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', (data: MessageProps) => {
      setChatMessageArray((prev) => [...prev, data]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  //chat
  const chatHandler = () => {
    setIsChat(!isChat);
  };
  return (
    <>
      {isResult && <Result member={member} moneys={moneys} />}
      <main className={styles.all}>
        <div
          className={isChat === true ? styles.gameBoard : ''}
          style={{ height: '100vh' }}
        >
          {isChat && (
            <Chat yourInfo={yourInfo} chatMessageArray={chatMessageArray} />
          )}
          <div className={styles.gameField}>
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
              chatHandler={chatHandler}
            />
          </div>

          <EventPopUp
            isEventPop={isEventPop}
            eventDetails={eventDetails}
            member={member}
            currentPlayer={currentPlayer}
            yourInfo={yourInfo}
            eventIgnition={eventIgnition}
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
        </div>
      </main>
    </>
  );
}
