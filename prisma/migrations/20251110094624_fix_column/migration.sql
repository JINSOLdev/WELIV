/*
  Warnings:

  - You are about to drop the column `stauts` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `paasswordHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "stauts",
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "paasswordHash",
ADD COLUMN     "passwordHash" TEXT NOT NULL;
