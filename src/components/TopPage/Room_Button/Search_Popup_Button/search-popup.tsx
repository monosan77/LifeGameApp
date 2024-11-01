import { useState } from 'react';
import styles from './search-popup.module.css';
import { Members } from '@/types/session';
import Link from 'next/link';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
}

interface RoomData {
  id: string;
  players: Members[];
}

interface ApiResponse {
  id: string;
  member: Members[];
}

export default function SearchPopup({ closeChanger, findPop }: Props) {
  const [nameId, setNameId] = useState('');
  const [isSearchingResult, setIsSearchingResult] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isWaitingScreen, setIsWaitingScreen] = useState(true);

  async function searchingHandler() {
    if (nameId === '') {
      alert('ルームIDを入れてください');
      return;
    }

    setRoomData(null);
    setIsSearchingResult(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${nameId}`
      );

      if (!res.ok) {
        throw new Error('検索できませんでした。');
      }

      const data: ApiResponse = await res.json();

    

      if (data && typeof data.id === 'string') {
        const formattedData: RoomData = {
          id: data.id,
          players: data.member,
        };
        setRoomData(formattedData);
        setIsSearchingResult(true);
      } else {
        setRoomData(null);
        setIsSearchingResult(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`エラーが発生しました: ${error.message}`);
      } else {
        console.error(`不明なエラーが発生しました: ${String(error)}`);
      }

      setIsSearchingResult(true);
    }
    // console.log(roomData?.players);
  }

  function determinationHandler() {
    setIsWaitingScreen(!isWaitingScreen);
  }

  // console.log(roomData?.players);

  return (
    <>
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
                placeholder="入力してください..."
                value={nameId}
                onChange={(e) => {
                  setNameId(e.target.value);
                  setIsSearchingResult(false);
                }}
              />
              <button onClick={searchingHandler}>検索</button>
            </div>
            <div
              className={
                isSearchingResult ? styles.searching : styles.notSearching
              }
            >
              {roomData ? (
                <div className={styles.searchCandidates}>
                  <p>ボン・クレーさんのルームでよろしいですか？</p>
                  <Link href="/waiting-room" onClick={determinationHandler}>
                    確定
                  </Link>
                </div>
              ) : (
                isSearchingResult && (
                  <div className={styles.notFound}>
                    <p>検索候補が見つかりませんでした。</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
