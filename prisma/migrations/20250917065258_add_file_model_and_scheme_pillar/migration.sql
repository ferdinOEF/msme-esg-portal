/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Link` table. All the data in the column will be lost.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_toId_fkey";

-- DropIndex
DROP INDEX "File_schemeId_idx";

-- DropIndex
DROP INDEX "LegalDoc_title_key";

-- DropIndex
DROP INDEX "Link_fromId_idx";

-- DropIndex
DROP INDEX "Link_toId_idx";

-- DropIndex
DROP INDEX "Scheme_name_key";

-- DropIndex
DROP INDEX "Template_title_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "sizeBytes" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "uploadedBy" TEXT;

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Scheme" ADD COLUMN     "pillar" TEXT,
ALTER COLUMN "authority" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Scheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Scheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
