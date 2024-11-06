import { useState } from 'react';
import styles from './search-popup.module.css';
import { Members } from '@/types/session';
import { useRouter } from 'next/router';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
  playerName: string;
}

interface RoomData {
  id: string;
  players: Members[];
}

interface ApiResponse {
  id: string;
  member: Members[];
}

export default function SearchPopup({
  closeChanger,
  findPop,
  playerName,
}: Props) {
  const [nameId, setNameId] = useState('');
  const [isSearchingResult, setIsSearchingResult] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isWaitingScreen, setIsWaitingScreen] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearchingResult(false);
    if (alertMessage) {
      setAlertMessage('');
    }
    if (/^\d*$/.test(value)) {
      setNameId(value);
      setAlertMessage(''); // エラーをクリア
    } else {
      setAlertMessage('数字のみを入力してください');
    }
  };

  async function searchingHandler() {
    if (nameId === '') {
      setAlertMessage('※ルームIDを入力してください。');
      return;
    } else if (nameId.length < 6) {
      setAlertMessage('※6桁の数字を入力してください。');
    }

    setRoomData(null);
    setIsSearchingResult(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/get-room-info?roomId=${nameId}`
      );
      console.log(nameId);

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
        setIsSearchingResult(false);
      } else {
        setRoomData(null);
        setIsSearchingResult(true);
      }
      setIsSearchingResult(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`エラーが発生しました: ${error.message}`);
      } else {
        console.error(`不明なエラーが発生しました: ${String(error)}`);
      }
    }
    // console.log(roomData?.players);
  }

  // console.log(roomData);

  async function determinationHandler() {
    setIsWaitingScreen(!isWaitingScreen);
    if (roomData) {
      // if (nameId !== roomData.id) {
      //   setAlertMessage('※ルームIDが違います。');
      //   return;
      // }
      // console.log(roomData);

      try {
        const roomInfo = { id: roomData.id, member: roomData.players };
        const player = playerName;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/join?=${roomData.id}
          `,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomInfo, player }),
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.message === 'すでに満室です') {
            setAlertMessage(`※${errorData.message}。`);
          }
          throw new Error('リクエストが失敗しました。');
        }
        // console.log(res);
        const data = await res.json();

        if(!data){
          setAlertMessage(`※${data.message}。`);
          throw new Error('リクエストが失敗しました。');
        }

        // console.log(data);

        sessionStorage.setItem(
          'userInfo',
          JSON.stringify({ id: data.playerId, name: player, host: false })
        );

        router.push({
          pathname: '/waiting-room',
          query: { id: roomData.id },
        });

      } catch (error) {
        console.error(error);
      }
    }
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
            {alertMessage && <p className={styles.alert}>{alertMessage}</p>}
            <div className={styles.search}>
              <input
                type="text"
                placeholder="入力してください..."
                value={nameId}
                onChange={handleInputChange}
                maxLength={6}
                // onChange={(e) => {
                //   setNameId(e.target.value);
                //   setIsSearchingResult(false);
                //   if(alertMessage){
                //     setAlertMessage('');
                //   }
                // }}
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
                  <p>
                    {roomData.players[0].name}さんのルームでよろしいですか？
                  </p>
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
      ;
    </>
  );
}
