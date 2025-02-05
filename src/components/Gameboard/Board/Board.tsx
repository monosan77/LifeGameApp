import React from 'react';
import styles from './Board.module.css';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import Square from './Square/Square';

interface Props {
  playerPositions: number[];
  isErrorAnimation: boolean;
  errorMessage: string;
}

const Board = ({ playerPositions, isErrorAnimation, errorMessage }: Props) => {
  // const isReserve = false;
  return (
    <section className={styles.board}>
      {/* 1行目 */}
      <div className={styles.road1} id="road1"></div>
      <div className={styles.row1}>
        <div className={`${styles.space} ${styles.start}`} id="start">
          START
          {/* プレイヤー1がこの位置にいる場合 */}
          <Square
            playerPositions={playerPositions}
            squareNumber={0}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-1">
          1
          <Square
            playerPositions={playerPositions}
            squareNumber={1}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-2">
          2
          <Square
            playerPositions={playerPositions}
            squareNumber={2}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-3">
          3
          <Square
            playerPositions={playerPositions}
            squareNumber={3}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-4">
          4
          <Square
            playerPositions={playerPositions}
            squareNumber={4}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-5">
          5
          <Square
            playerPositions={playerPositions}
            squareNumber={5}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-6">
          6
          <Square
            playerPositions={playerPositions}
            squareNumber={6}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-7">
          7
          <Square
            playerPositions={playerPositions}
            squareNumber={7}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-8">
          8
          <Square
            playerPositions={playerPositions}
            squareNumber={8}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-9">
          9
          <Square
            playerPositions={playerPositions}
            squareNumber={9}
            isReserved={false}
          />
          <div className={styles.verticalBox1}></div>
        </div>
      </div>

      {/* 2行目 */}
      <div className={styles.road2} id="road2"></div>
      <div className={styles.row2}>
        <div className={`${styles.space} ${styles.secret}`} id="space-18">
          18
          <Square
            playerPositions={playerPositions}
            squareNumber={18}
            isReserved={true}
          />
          <div className={styles.verticalBox1}></div>
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-17">
          17
          <Square
            playerPositions={playerPositions}
            squareNumber={17}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-16">
          16
          <Square
            playerPositions={playerPositions}
            squareNumber={16}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-15">
          15
          <Square
            playerPositions={playerPositions}
            squareNumber={15}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-14">
          14
          <Square
            playerPositions={playerPositions}
            squareNumber={14}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-13">
          13
          <Square
            playerPositions={playerPositions}
            squareNumber={13}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-12">
          12
          <Square
            playerPositions={playerPositions}
            squareNumber={12}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-11">
          11
          <Square
            playerPositions={playerPositions}
            squareNumber={11}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-10">
          10
          <Square
            playerPositions={playerPositions}
            squareNumber={10}
            isReserved={true}
          />
        </div>
      </div>

      {/* 3行目 */}
      <div className={styles.road3} id="road3"></div>
      <div className={styles.row3}>
        <div className={`${styles.space} ${styles.secret}`} id="space-19">
          19
          <Square
            playerPositions={playerPositions}
            squareNumber={19}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-20">
          20
          <Square
            playerPositions={playerPositions}
            squareNumber={20}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-21">
          21
          <Square
            playerPositions={playerPositions}
            squareNumber={21}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-22">
          22
          <Square
            playerPositions={playerPositions}
            squareNumber={22}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-23">
          23
          <Square
            playerPositions={playerPositions}
            squareNumber={23}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-24">
          24
          <Square
            playerPositions={playerPositions}
            squareNumber={24}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-25">
          25
          <Square
            playerPositions={playerPositions}
            squareNumber={25}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-26">
          26
          <Square
            playerPositions={playerPositions}
            squareNumber={26}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-27">
          27
          <Square
            playerPositions={playerPositions}
            squareNumber={27}
            isReserved={false}
          />
          <div className={styles.verticalBox1}></div>
        </div>
      </div>

      {/* 4行目 */}
      <div className={styles.road4} id="road4"></div>
      <div className={styles.row4}>
        <div className={`${styles.space} ${styles.secret}`} id="space-38">
          38
          <Square
            playerPositions={playerPositions}
            squareNumber={38}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-37">
          37
          <Square
            playerPositions={playerPositions}
            squareNumber={37}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-36">
          36
          <Square
            playerPositions={playerPositions}
            squareNumber={36}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-35">
          35
          <Square
            playerPositions={playerPositions}
            squareNumber={35}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-34">
          34
          <Square
            playerPositions={playerPositions}
            squareNumber={34}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-33">
          33
          <Square
            playerPositions={playerPositions}
            squareNumber={33}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-33">
          32
          <Square
            playerPositions={playerPositions}
            squareNumber={32}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-31">
          31
          <Square
            playerPositions={playerPositions}
            squareNumber={31}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-30">
          30
          <Square
            playerPositions={playerPositions}
            squareNumber={30}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-29">
          29
          <Square
            playerPositions={playerPositions}
            squareNumber={29}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-28">
          28
          <Square
            playerPositions={playerPositions}
            squareNumber={28}
            isReserved={true}
          />
        </div>
      </div>

      {/* 5行目 */}
      <div className={styles.road5} id="road5"></div>
      <div className={styles.row5}>
        <div className={`${styles.space} ${styles.plus}`} id="space-39">
          39
          <Square
            playerPositions={playerPositions}
            squareNumber={39}
            isReserved={false}
          />
          <div className={styles.verticalBox2}></div>
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-40">
          40
          <Square
            playerPositions={playerPositions}
            squareNumber={40}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-41">
          41
          <Square
            playerPositions={playerPositions}
            squareNumber={41}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-42">
          42
          <Square
            playerPositions={playerPositions}
            squareNumber={42}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-43">
          43
          <Square
            playerPositions={playerPositions}
            squareNumber={43}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-44">
          44
          <Square
            playerPositions={playerPositions}
            squareNumber={44}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-45">
          45
          <Square
            playerPositions={playerPositions}
            squareNumber={45}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-46">
          46
          <Square
            playerPositions={playerPositions}
            squareNumber={46}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.minus}`} id="space-47">
          47
          <Square
            playerPositions={playerPositions}
            squareNumber={47}
            isReserved={false}
          />
        </div>
        <div className={`${styles.space} ${styles.plus}`} id="space-48">
          48
          <Square
            playerPositions={playerPositions}
            squareNumber={48}
            isReserved={false}
          />
          <div className={styles.verticalBox1}></div>
        </div>
      </div>

      {/* 6行目 */}
      <div className={`${styles.road6}`} id="road6"></div>
      <div className={styles.row6}>
        <div className={`${styles.space} ${styles.goal}`} id="goal">
          GOAL
          <Square
            playerPositions={playerPositions}
            squareNumber={51}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-50">
          50
          <Square
            playerPositions={playerPositions}
            squareNumber={50}
            isReserved={true}
          />
        </div>
        <div className={`${styles.space} ${styles.secret}`} id="space-49">
          49
          <Square
            playerPositions={playerPositions}
            squareNumber={49}
            isReserved={true}
          />
        </div>
      </div>

      <ErrorMessage
        isErrorAnimation={isErrorAnimation}
        errorMessage={errorMessage}
      />
    </section>
  );
};

export default Board;
