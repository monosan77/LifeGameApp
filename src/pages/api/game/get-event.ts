import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { roomId } = req.query;
      const { eventId, currentPlayer, moneys } = req.body;
      if (
        !roomId ||
        !eventId ||
        (!currentPlayer && currentPlayer !== 0) ||
        !moneys
      ) {
        return res
          .status(400)
          .json({ error: 'リクエストエラー:queryまたはbodyエラー' });
      }
      const eventInfo: Event_Mold = await fetchJSON(
        `${process.env.API_BACK_URL}/event_table/${eventId}`
      );

      let beforeMoney = [...moneys];
      let newMoney = [...moneys];
      if (eventInfo.event.event_type === 'plus') {
        newMoney[currentPlayer] += eventInfo.event.value;
      } else if (eventInfo.event.event_type === 'minus') {
        newMoney[currentPlayer] -= eventInfo.event.value;
      }

      const response = await fetchJSON(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/get-event-pusher?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventInfo, beforeMoney, newMoney }),
        }
      );
      return res.status(200).json({ message: '正常に同期できました。' });
      // console.log(eventInfo);
    } else {
      return res.status(405).json({ error: '不正なリクエスト:methodエラー' });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: `sever error : ${error.message}` });
  }
  // res.status(200).json({ message: 'ok' });
}
