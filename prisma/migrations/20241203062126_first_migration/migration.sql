-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "limitPlayer" INTEGER NOT NULL,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" BOOLEAN NOT NULL,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
