/*
  Warnings:

  - You are about to drop the `GroupTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupTag" DROP CONSTRAINT "_GroupTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupTag" DROP CONSTRAINT "_GroupTag_B_fkey";

-- DropTable
DROP TABLE "GroupTag";

-- DropTable
DROP TABLE "_GroupTag";

-- CreateTable
CREATE TABLE "GroupCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupCategories_name_key" ON "GroupCategories"("name");

-- CreateIndex
CREATE INDEX "_GroupCategories_B_index" ON "_GroupCategories"("B");

-- AddForeignKey
ALTER TABLE "_GroupCategories" ADD CONSTRAINT "_GroupCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupCategories" ADD CONSTRAINT "_GroupCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
