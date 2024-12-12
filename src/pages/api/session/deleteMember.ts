import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Members, RoomInfo } from '@/types/session';

const prisma = new PrismaClient();
interface BodyData {
  yourInfo: Members;
  roomData: RoomInfo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: 'リクエストエラー : メソッドが不正です' });
  }
  try {
    const { roomId } = req.query;
    const { yourInfo, roomData }: BodyData = req.body;
    if (!roomId || !roomData || !yourInfo) {
      throw new Error('リクエストエラー : bodyが不正です');
    }
    const uniqueId: string = Array.isArray(roomId) ? roomId[0] : roomId;

    const newMember: Members[] = roomData.member.filter(
      (member) => member.id !== yourInfo.id
    );

    // console.log(new)
    await prisma.member.deleteMany({
      where: {
        gameRoomId: uniqueId,
      },
    });

    await prisma.member.createMany({
      data: newMember.map((member) => ({
        id: member.id,
        name: member.name,
        host: member.host,
        gameRoomId: uniqueId,
      })),
    });
    console.log(newMember, 'newmember');
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'server error' });
  }
}
