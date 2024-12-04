-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('plus', 'minus', 'special', 'goal');

-- CreateTable
CREATE TABLE "EventContainer" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "event_type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "specialEventId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialEvent" (
    "id" TEXT NOT NULL,
    "conditions" TEXT[],
    "effect_type" TEXT NOT NULL,
    "effect_value" INTEGER[],
    "base_amount" INTEGER[],

    CONSTRAINT "SpecialEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventContainer" ADD CONSTRAINT "EventContainer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_specialEventId_fkey" FOREIGN KEY ("specialEventId") REFERENCES "SpecialEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
