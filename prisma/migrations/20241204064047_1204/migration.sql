-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_gameRoomId_fkey";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
