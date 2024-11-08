import styles from './gameboard.module.css';
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import TaunChangeTelop from './TaunChangeTelop/TaunChangeTelop';
import Roulette from './Roulette/Roulette';
import { Members } from '@/types/session';
import TurnDisplay from './TurnDisplay/TurnDisplay';
import Board from './Board/Board';
import BottomBar from './BottomBar/BottomBar';

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
        currentPlayer={currentPlayer}
        rollDice={rollDice}
        diceResult={diceResult}
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
