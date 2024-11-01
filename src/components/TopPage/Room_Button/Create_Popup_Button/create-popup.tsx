import styles from './create-popup.module.css';

interface Props {
  closeChanger: () => void;
  createPop: boolean;
  onSelectPlayers:(playerCount:number, playerName:string) => void;
  playerName:string;
}

export default function CreatePopup({ closeChanger, createPop, onSelectPlayers, playerName }: Props) {
  const handlePlayerSelect = (count:number) => {
    console.log('create-popup.tsx - 選択された人数:', count); // 追加
    console.log('create-popup.tsx - playerName:', playerName); // 追加
    onSelectPlayers(count, playerName);
  };

  return (
    <div className={createPop ? styles.visibl : styles.hidde}>
      <div className={createPop ? styles.createPop : styles.createNoPop}>
        <div className={styles.friendPop}>
          <div className={styles.close}>
            <button onClick={closeChanger}>X</button>
          </div>
          <p>何人と遊ぶ？</p>
          <div className={styles.number}>
            {[2, 3, 4, 5].map((count) => (
              <button key={count} onClick={() => handlePlayerSelect(count)}>
                {count}人
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
