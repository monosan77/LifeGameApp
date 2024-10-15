// 参加プレイヤーをほかユーザに共有
export async function sharePlayers(roomId: number) {
  await fetch(`/api/waitRoom-pusher?roomId=${roomId}`);
}
