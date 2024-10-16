import styles from './create_popup.module.css';

interface Props {
  closeChanger: () => void;
  createPop: boolean;
}

export default function CreatePopup({ closeChanger, createPop }: Props) {
  return (
    <>
      <div className={createPop ? styles.visibl : styles.hidde}>
        <div className={createPop ? styles.createPop : styles.createNoPop}>
          <div className={styles.friendPop}>
            <div className={styles.close}>
              <button onClick={closeChanger}>X</button>
            </div>
            <p>何人と遊ぶ？</p>
            <div className={styles.number}>
              <button>2人</button>
              <button>3人</button>
              <button>4人</button>
              <button>5人</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
