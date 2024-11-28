import { NextApiRequest, NextApiResponse } from 'next';
interface API_request {
  eventDetails: Event_Mold;
  moneys: number[];
  currentPlayer: number;
}
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/rescue-event-pusher?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rescueEvent }),
        }
      );
      if (!res.ok) {
        throw new Error('pusherリクエストエラー');
      }
      const data = await res.json();
      console.log(data);
    }
  } catch (error: any) {
    console.log(error.massage);
  }
  const { rescueEvent } = req.body;
  // console.log(rescueEvent.event.special_event);
  res.status(200).json({ rescueEvent });
}
