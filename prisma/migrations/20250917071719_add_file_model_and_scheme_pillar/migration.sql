/*
  Warnings:

  - You are about to drop the column `filename` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `sizeBytes` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `File` table. All the data in the column will be lost.
  - The `status` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `title` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('CIRCULAR', 'FAQ', 'GUIDELINE', 'SUPPORTING', 'OTHER');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PENDING');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "filename",
DROP COLUMN "kind",
DROP COLUMN "mimeType",
DROP COLUMN "sizeBytes",
DROP COLUMN "uploadedBy",
ADD COLUMN     "storageKey" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "FileType" NOT NULL DEFAULT 'SUPPORTING',
ALTER COLUMN "url" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'UPLOADED';
