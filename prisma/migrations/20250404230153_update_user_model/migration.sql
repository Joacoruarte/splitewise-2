/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "external_id" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");
