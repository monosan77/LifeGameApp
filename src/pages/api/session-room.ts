import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Members, RoomInfo } from '../sample/game-page';

async function fetchJSON(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      return await handlePostRequest(req, res);
    }
    if (req.method === 'GET') {
      return await handleGetRequest(req, res);
    }
    if (req.method === 'PATCH') {
      return await handlePatchRequest(req, res);
    }
    if (req.method === 'DELETE') {
      return await handleDeleteRequest(req, res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { limitPlayer, playerName } = req.body;
  const generateRandomNumber = () => {
    // 100000から999999までのランダムな6桁の数値を生成
    return Math.floor(100000 + Math.random() * 900000);
  };
  const roomId = generateRandomNumber().toString();

  try {
    const getRoomId = await fetch(`http://localhost:8000/room?id=${roomId}`);
    const data = await getRoomId.json();
    if (data.length > 0) {
      return res
        .status(409)
        .json({ message: 'ルームを作成できませんでした。' });
    }
    const yourId = uuidv4();
    // ルームを作成したプレイヤーがルームホストになる
    const members = [{ id: yourId, name: playerName, host: true }];

    const postRoomId = await fetch('http://localhost:8000/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: roomId,
        limitPlayer: limitPlayer,
        member: members,
      }),
    });
    if (!postRoomId.ok) {
      throw new Error(`HTTP Error! status:${postRoomId.status}`);
    }
    return res.status(200).json({ roomId, yourId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  if (!roomId) {
    return res.status(500).json({ message: 'ルームが存在ありません' });
  }
  try {
    const roomInfo = await fetchJSON(`http://localhost:8000/room/${roomId}`);
    if (!roomInfo || roomInfo.length === 0) {
      return res.status(409).json({ message: 'ルームが存在ありません' });
    }
    res.status(200).json(roomInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}

async function handlePatchRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { playerName, roomInfo } = req.body;

    const CheckPlayer: RoomInfo = await fetchJSON(
      `http://localhost:8000/room/${roomInfo.id}`
    );
    if (CheckPlayer.limitPlayer <= CheckPlayer.member.length) {
      return res.status(404).json({ message: 'すでに満室です' });
    }
    const playerId = uuidv4();
    const newMember = [
      ...CheckPlayer.member,
      { id: playerId, name: playerName, host: false },
    ];
    const response = await fetch(`http://localhost:8000/room/${roomInfo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member: newMember }), // 部分的に更新
    });
    if (!response.ok) {
      return res.status(409).json({ message: '更新できませんでした。' });
    }
    return res.status(200).json(playerId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const { playerInfo } = req.body;
  if (!roomId || !playerInfo) {
    return res.status(404).json({ message: '不正なリクエストです' });
  }

  try {
    if (playerInfo.host) {
      const response = await fetch(`http://localhost:8000/room/${roomId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! status:${response.status}`);
      }
      return res.status(200).json({ message: 'ルームを削除しました。' });
    }

    const roomInfo = await fetchJSON(`http://localhost:8000/room/${roomId}`);
    const newMember = roomInfo.member.filter(
      (player: Members) => player.id !== playerInfo.id
    );
    const deletMember = await fetch(
      `http://localhost:8000/room/${roomInfo.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ member: newMember }), // 部分的に更新
      }
    );
    if (!deletMember.ok) {
      throw new Error(`HTTP Error! status: ${deletMember.status}`);
    }
    return res.status(200).json({ message: '退室しました' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}
