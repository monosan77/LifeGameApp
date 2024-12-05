import { useState } from 'react';
import styles from './search-popup.module.css';
import { Members } from '@/types/session';
import { useRouter } from 'next/router';
import ShowError from '../Create_Popup_Button/showError';
import Loading from '@/components/Loading/Loading';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
  player: string;
}

interface RoomData {
  id: string;
  players: Members[];
}

interface ApiResponse {
  id: string;
  member: Members[];
}

export default function SearchPopup({ closeChanger, findPop, player }: Props) {
  const [nameId, setNameId] = useState('');
  const [isSearchingResult, setIsSearchingResult] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearchingResult(false);
    if (/^\d*$/.test(value)) {
      setNameId(value);
      setAlertMessage('');
    } else {
      setAlertMessage('数字のみを入力してください');
    }
  };

  async function searchingHandler() {
    console.log(nameId);
    if (nameId === '') {
      setAlertMessage('※ルームIDを入力してください。');
      return;
    } else if (nameId.length < 6) {
      setAlertMessage('※6桁の数字を入力してください。');
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
        setIsSearchingResult(false);
      } else {
        setRoomData(null);
        setIsSearchingResult(true);
      }
      setIsSearchingResult(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof Error) {
        // console.error(`エラーが発生しました: ${error.message}`);
        setAlertMessage('IDが見つかりません。');
      }
    }
  }

  const [loading, setLoading] = useState(false);
  async function determinationHandler() {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const roomInfo = { id: roomData?.id, member: roomData?.players };
      const playerName = player;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/join
            `,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomInfo, playerName }),
        }
      );
      if (!res.ok) {
        throw new Error('※すでに満室です。');
      }
      const data = await res.json();

      sessionStorage.setItem(
        'userInfo',
        JSON.stringify({ id: data.playerId, name: player, host: false })
      );
      setLoading(false);

      router.push(`/game?roomId=${roomData?.id}&userId=${data.playerId}`);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setAlertMessage('※すでに満室です。');
    }
  }

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
                onChange={handleInputChange}
                maxLength={6}
              />
              <button onClick={searchingHandler}>検索</button>
            </div>
            {alertMessage && (
              <p data-testid="message" className={styles.alert}>
                {alertMessage}
              </p>
            )}
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

      {loading && <Loading loadingText="ルームを作成中・・・" />}
    </>
  );
}
