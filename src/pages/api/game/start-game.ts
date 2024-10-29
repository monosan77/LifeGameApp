import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      return await handleStartGame(req, res);
    }
    return res.status(405).json({ message: '不正なリクエストメソッドです。' });
  } catch (error) {
    console.log(error);
  }
}

async function handleStartGame(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(405).json({ message: 'リクエストエラー　不正なクエリ' });
  }

  const res0 = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/start-game?roomId=${roomId}`
  );
  if (!res0.ok) {
    const data = await res0.json();
    console.log(data);
  }
  return res.status(200).json({ message: 'ok' });
}
