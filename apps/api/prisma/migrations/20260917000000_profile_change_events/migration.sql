-- CreateEnum
CREATE TYPE "ProfileField" AS ENUM ('DISPLAY_NAME', 'EMAIL');

-- CreateTable
CREATE TABLE "ProfileChangeEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sequence" SERIAL NOT NULL,
    "field" "ProfileField" NOT NULL,
    "previousValue" TEXT NOT NULL,
    "nextValue" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileChangeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileChangeEvent_userId_sequence_key" ON "ProfileChangeEvent"("userId", "sequence");

-- CreateIndex
CREATE INDEX "ProfileChangeEvent_userId_createdAt_idx" ON "ProfileChangeEvent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProfileChangeEvent" ADD CONSTRAINT "ProfileChangeEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
