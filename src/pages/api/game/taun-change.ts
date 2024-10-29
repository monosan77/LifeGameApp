import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return await getNextPlayer(req, res);
  }
  res.status(200).json({
    message: 'ok',
  });
}

async function getNextPlayer(req: NextApiRequest, res: NextApiResponse) {
  const { currentPlayer, newPosition } = req.body;
  const nextPlayer = moveToNextPlayer(currentPlayer, newPosition);
  res.status(200).json(nextPlayer);
}

const moveToNextPlayer = (currentPlayer: number, newPosition: number[]) => {
  let nextPlayer = (currentPlayer + 1) % newPosition.length;

  //  次のプレイヤーの位置が50以上ならスキップ
  while (newPosition[nextPlayer] > 50) {
    nextPlayer = (nextPlayer + 1) % newPosition.length;

    // 全員が50以上の場合に無限ループしないためのチェック
    if (nextPlayer === currentPlayer) {
      console.log('全てのプレイヤーが50以上に到達しました');
      return -1; // 全員スキップの状態
    }
  }
  return nextPlayer;
};
