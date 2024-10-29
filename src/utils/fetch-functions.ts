// 参加プレイヤーをほかユーザに共有
export async function sharePlayers(roomId: number) {
  await fetch(`/api/pusher/wait-room?roomId=${roomId}`);
}

// fetchしたデータをjsに変換したものを返却
export async function fetchJSON(url: string) {
  console.log('ududuS');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
