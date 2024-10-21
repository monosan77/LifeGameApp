// src/components/TopPage/PageLinks.tsx
import styles from './search-popup.module.css';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
}

export default function SearchPopup({ closeChanger, findPop }: Props) {

  return (
      <div className={findPop ? styles.visibles : styles.hiddens}>
        <div className={findPop ? styles.findPop : styles.findNoPop}>
          <div className={styles.searchPop}>
            <div className={styles.close}>
              <button onClick={closeChanger}>X</button>
            </div>
            <p>ルームを検索してね！</p>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="&nbsp;&nbsp;入力してください..."
              />
              <button>検索</button>
            </div>
          </div>
        </div>
      </div>
  );
}
