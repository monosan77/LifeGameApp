import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { roomId } = req.query;
    const diceResult = getDiceNumber();

    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/result-dice?roomId=${roomId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diceResult),
      }
    );
    // const data = await response.json();
    res.status(200).json({ message: 'ok' });
  }
}

function getDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}
