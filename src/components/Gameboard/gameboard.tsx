import styles from './gameboard.module.css';
import React, { useState } from 'react';

export default function Gameboard() {
  const [playerPositions, setPlayerPositions] = useState([0, 0, 0]); // 3人のプレイヤーの位置を管理（初期値は全員0）
  const [currentPlayer, setCurrentPlayer] = useState(0); // 現在のプレイヤーを追跡
  const [diceResult, setDiceResult] = useState(null); // ダイスの結果を管理
  const [playersFinished, setPlayersFinished] = useState([]);

  // ダイスを振る関数
  const rollDice = () => {
    if (playersFinished.includes(currentPlayer)) {
      // 既にゴールしているプレイヤーはスキップ
      moveToNextPlayer(); // 次のプレイヤーに移行
      return;
    }

    const result = Math.floor(Math.random() * 6) + 1; // 1〜6のランダムな数字を生成
    setDiceResult(result); // ダイスの結果を設定

    // 現在のプレイヤーの位置を更新
    setPlayerPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      const newPosition = updatedPositions[currentPlayer] + result;

      if (newPosition > 50) {
        // ゴールに到達したら50番目のマスを超えて、ゴールに移動
        updatedPositions[currentPlayer] = 51;
        setPlayersFinished([...playersFinished, currentPlayer]); // ゴールしたプレイヤーを追加
      } else {
        updatedPositions[currentPlayer] = newPosition;
      }
      return updatedPositions;
    });

    // プレイヤーターンを次に移行する
    moveToNextPlayer();
  };

  // 次のプレイヤーにターンを移す関数
  const moveToNextPlayer = () => {
    let nextPlayer = (currentPlayer + 1) % playerPositions.length;

    // ゴールしているプレイヤーをスキップ
    while (playersFinished.includes(nextPlayer)) {
      nextPlayer = (nextPlayer + 1) % playerPositions.length;

      // もし全員がゴールしていたらループから抜ける
      if (playersFinished.length === playerPositions.length) {
        return; // 全員がゴールしているので何もしない
      }
    }

    // 次のプレイヤーにターンを移す
    setCurrentPlayer(nextPlayer);
  };

  return (
    <main className={styles.all}>
      <section className={styles.term}>
        {`プレイヤー${currentPlayer + 1}のターン`}
      </section>

      <section className={styles.board}>
        {/* 1行目 */}
        <div className={styles.road1} id="road1"></div>
        <div className={styles.row1}>
          <div className={`${styles.space} ${styles.start}`} id="start">
            START
            {/* プレイヤー1がこの位置にいる場合 */}
            {playerPositions[0] === 0 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {/* プレイヤー2がこの位置にいる場合 */}
            {playerPositions[1] === 0 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {/* プレイヤー3がこの位置にいる場合 */}
            {playerPositions[2] === 0 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-1">
            1
            {playerPositions[0] === 1 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 1 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 1 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-2">
            2
            {playerPositions[0] === 2 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 2 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 2 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-3">
            3
            {playerPositions[0] === 3 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 3 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 3 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-4">
            4
            {playerPositions[0] === 4 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 4 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 4 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-5">
            5
            {playerPositions[0] === 5 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 5 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 5 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-6">
            6
            {playerPositions[0] === 6 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 6 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 6 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-7">
            7
            {playerPositions[0] === 7 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 7 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 7 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-8">
            8
            {playerPositions[0] === 8 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 8 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 8 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-9">
            9
            {playerPositions[0] === 9 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 9 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 9 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 2行目 */}
        <div className={styles.road2} id="road2"></div>
        <div className={styles.row2}>
          <div className={`${styles.space} ${styles.secret}`} id="space-18">
            18
            {playerPositions[0] === 18 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 18 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 18 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
            <div className={styles.verticalBox1}></div>
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-17">
            17
            {playerPositions[0] === 17 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 17 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 17 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-16">
            16
            {playerPositions[0] === 16 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 16 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 16 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-15">
            15
            {playerPositions[0] === 15 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 15 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 15 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-14">
            14
            {playerPositions[0] === 14 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 14 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 14 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-13">
            13
            {playerPositions[0] === 13 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 13 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 13 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-12">
            12
            {playerPositions[0] === 12 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 12 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 12 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-11">
            11
            {playerPositions[0] === 11 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 11 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 11 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-10">
            10
            {playerPositions[0] === 10 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 10 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 10 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
        </div>

        {/* 3行目 */}
        <div className={styles.road3} id="road3"></div>
        <div className={styles.row3}>
          <div className={`${styles.space} ${styles.secret}`} id="space-19">
            19
            {playerPositions[0] === 19 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 19 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 19 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-20">
            20
            {playerPositions[0] === 20 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 20 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 20 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-21">
            21
            {playerPositions[0] === 21 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 21 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 21 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-22">
            22
            {playerPositions[0] === 22 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 22 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 22 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-23">
            23
            {playerPositions[0] === 23 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 23 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 23 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-24">
            24
            {playerPositions[0] === 24 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 24 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 24 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-25">
            25
            {playerPositions[0] === 25 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 25 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 25 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-26">
            26
            {playerPositions[0] === 26 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 26 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 26 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-27">
            27
            {playerPositions[0] === 27 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 27 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 27 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 4行目 */}
        <div className={styles.road4} id="road4"></div>
        <div className={styles.row4}>
          <div className={`${styles.space} ${styles.secret}`} id="space-38">
            38
            {playerPositions[0] === 38 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 38 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 38 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-37">
            37
            {playerPositions[0] === 37 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 37 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 37 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-36">
            36
            {playerPositions[0] === 36 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 36 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 36 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-35">
            35
            {playerPositions[0] === 35 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 35 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 35 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-34">
            34
            {playerPositions[0] === 34 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 34 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 34 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-33">
            33
            {playerPositions[0] === 33 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 33 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 33 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-33">
            32
            {playerPositions[0] === 32 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 32 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 32 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-31">
            31
            {playerPositions[0] === 31 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 31 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 31 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-30">
            30
            {playerPositions[0] === 30 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 30 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 30 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-29">
            29
            {playerPositions[0] === 29 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 29 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 29 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-28">
            28
            {playerPositions[0] === 28 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 28 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 28 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
        </div>

        {/* 5行目 */}
        <div className={styles.road5} id="road5"></div>
        <div className={styles.row5}>
          <div className={`${styles.space} ${styles.plus}`} id="space-39">
            39
            {playerPositions[0] === 39 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 39 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 39 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
            <div className={styles.verticalBox2}></div>
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-40">
            40
            {playerPositions[0] === 40 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 40 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 40 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-41">
            41
            {playerPositions[0] === 41 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 41 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 41 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-42">
            42
            {playerPositions[0] === 42 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 42 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 42 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-43">
            43
            {playerPositions[0] === 43 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 43 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 43 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-44">
            44
            {playerPositions[0] === 44 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 44 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 44 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-45">
            45
            {playerPositions[0] === 45 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 45 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 45 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-46">
            46
            {playerPositions[0] === 46 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 46 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 46 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-47">
            47
            {playerPositions[0] === 47 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 47 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 47 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-48">
            48
            {playerPositions[0] === 48 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 48 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 48 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 6行目 */}
        <div className={`${styles.road6}`} id="road6"></div>
        <div className={styles.row6}>
          <div className={`${styles.space} ${styles.goal}`} id="goal">
            GOAL
            {playerPositions[0] === 51 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 51 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 51 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-50">
            50
            {playerPositions[0] === 50 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 50 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 50 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-49">
            49
            {playerPositions[0] === 49 && (
              <div className={styles.carIcon}>🚗</div>
            )}
            {playerPositions[1] === 49 && (
              <div className={styles.carIcon}>🚙</div>
            )}
            {playerPositions[2] === 49 && (
              <div className={styles.carIcon}>🏎️</div>
            )}
          </div>
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
        <button className={styles.dice} onClick={rollDice}>
          dice
        </button>
        {diceResult && (
          <div className={styles.diceResult}>Dice: {diceResult}</div>
        )}
      </section>

      {/* 一旦保留：ゴールしたプレイヤーを表示 */}
      {playersFinished.length > 0 && (
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
      )}
    </main>
  );
}
