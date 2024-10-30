import { useState } from 'react';
import styles from './search-popup.module.css';
import WaitingRoom from '@/components/WaitingRoom/waiting-room';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
}

interface Players {
  id: string;
  name: string;
  host: boolean;
}

interface RoomData {
  id: string;
  players: Players[];
}

interface ApiResponse {
  id: string;
  member: Players[];
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
        `http://localhost:3000/api/session/get-room-info?roomId=${nameId}`
      );

      if (!res.ok) {
        throw new Error('検索できませんでした。');
      }

      const data: ApiResponse = await res.json();
      const formattedData: RoomData = {
        id: data.id,
        players: data.member,
      };

      if (data && typeof data.id === 'string') {
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
    console.log(roomData?.players);
  }

  function determinationHandler() {
    setIsWaitingScreen(!isWaitingScreen);
  }

  console.log(roomData?.players);

  return (
    <>
      {isWaitingScreen ? (
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
                    <p>{roomData.id}</p>
                    <button onClick={determinationHandler}>確定</button>
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
      ) : (
        roomData && (
          <WaitingRoom roomId={roomData.id} players={roomData.players} />
        )
      )}
      ;
    </>
  );
}
