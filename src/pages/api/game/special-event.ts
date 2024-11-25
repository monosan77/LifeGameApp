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
    if (req.method === 'POST') {
      const { eventDetails, moneys, currentPlayer }: API_request = req.body;
      const { diceResult } = req.query;

      if (
        !diceResult ||
        !eventDetails ||
        !moneys ||
        (!currentPlayer && currentPlayer !== 0)
      ) {
        return res
          .status(405)
          .json({ message: 'リクエストエラー:queryまたはbodyが不正です' });
      }
      // console.log(diceResult, 'ダイス結果');
      const specialEvent = eventDetails.event.special_event;
      let beforeMoney = [...moneys];
      let newMoney = [...moneys];
      console.log(moneys);
      specialEvent?.conditions.forEach((condition, index) => {
        const [min, max] = condition.split('-').map(Number); // "1-3" -> [1, 3]
        if (Number(diceResult) >= min && Number(diceResult) <= max) {
          console.log(min, max, 'min,max');
          console.log(diceResult, 'min,max');
          if (specialEvent.effect_type === '+-') {
            newMoney[currentPlayer] += specialEvent.effect_value[index];
            console.log(newMoney);
            // return res.status(200).json(newMoney);
          } else if (specialEvent.effect_type === '*/') {
            if (specialEvent.base_amount[0] === 0) {
              const baseAmount =
                newMoney[currentPlayer] * specialEvent.base_amount[1];
              newMoney[currentPlayer] +=
                baseAmount * specialEvent.effect_value[index] - baseAmount;
              // res.status(200).json(newMoney);
              // return;
            } else if (specialEvent.base_amount[0] !== 0) {
              const baseAmount = specialEvent.base_amount[0];
              newMoney[currentPlayer] +=
                baseAmount * specialEvent.effect_value[index] - baseAmount;
              // res.status(200).json(newMoney);
              // return;
            }
          }

          // return console.log(min, max, '該当しました。');
        }
      });
      return res.status(200).json({ beforeMoney, newMoney });
    } else {
      return res.status(405).json({ error: 'リクエストエラー:methodエラー' });
    }
  } catch (error: any) {
    console.error(error.massage);
  }
  res.status(200).json({ message: 'ok' });
}
