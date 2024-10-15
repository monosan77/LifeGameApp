import styles from '../styles/gameBoard.module.css';

export default function GameBoard() {
  return (
    <main className={styles.all}>
      <section className={styles.term}>○○のターン</section>
      <section className={styles.board}>
        {/* 1行目 */}
        <div className={styles.road1} id="road1"></div>
        <div className={styles.row1}>
          <div className={`${styles.space} ${styles.start}`} id="start">
            START
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-1">
            1
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-2">
            2
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-3">
            3
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-4">
            4
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-5">
            5
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-6">
            6
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-7">
            7
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-8">
            8
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-9">
            9<div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 2行目 */}
        <div className={styles.road2} id="road2"></div>
        <div className={styles.row2}>
          <div className={`${styles.space} ${styles.secret}`} id="space-18">
            18
            <div className={styles.verticalBox1}></div>
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-17">
            17
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-16">
            16
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-15">
            15
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-14">
            14
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-13">
            13
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-12">
            12
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-11">
            11
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-10">
            10
          </div>
        </div>

        {/* 3行目 */}
        <div className={styles.road3} id="road3"></div>
        <div className={styles.row3}>
          <div className={`${styles.space} ${styles.secret}`} id="space-19">
            19
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-20">
            20
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-21">
            21
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-22">
            22
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-23">
            23
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-24">
            24
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-25">
            25
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-26">
            26
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-27">
            27
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 4行目 */}
        <div className={styles.road4} id="road4"></div>
        <div className={styles.row4}>
          <div className={`${styles.space} ${styles.secret}`} id="space-38">
            38
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-37">
            37
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-36">
            36
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-35">
            35
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-34">
            34
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-33">
            32
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-31">
            31
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-30">
            30
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-29">
            29
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-28">
            28
          </div>
        </div>

        {/* 5行目 */}
        <div className={styles.road5} id="road5"></div>
        <div className={styles.row5}>
          <div className={`${styles.space} ${styles.plus}`} id="space-39">
            39
            <div className={styles.verticalBox2}></div>
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-40">
            40
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-41">
            41
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-42">
            42
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-43">
            43
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-44">
            44
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-45">
            45
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-46">
            46
          </div>
          <div className={`${styles.space} ${styles.minus}`} id="space-47">
            47
          </div>
          <div className={`${styles.space} ${styles.plus}`} id="space-48">
            48
            <div className={styles.verticalBox1}></div>
          </div>
        </div>

        {/* 6行目 */}
        <div className={`${styles.road6}`} id="road6"></div>
        <div className={styles.row6}>
          <div className={`${styles.space} ${styles.goal}`} id="goal">
            GOAL
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-50">
            50
          </div>
          <div className={`${styles.space} ${styles.secret}`} id="space-49">
            49
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
        <button className={styles.dice}>dice</button>
      </section>
    </main>
  );
}
