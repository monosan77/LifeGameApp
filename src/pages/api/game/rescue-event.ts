import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'リクエストエラー : methodエラー' });
    } else {
      const { roomId } = req.query;
      const { rescueEvent } = req.body;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/rescue-event-pusher?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rescueEvent }),
        }
      );
      if (!response.ok) {
        throw new Error('pusherリクエストエラー');
      }
      res.status(200).json({ message: '正常に終了しました。' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.massage);
  }
}
