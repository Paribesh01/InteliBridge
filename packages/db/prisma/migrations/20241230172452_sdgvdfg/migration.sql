/*
  Warnings:

  - Added the required column `subType` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subType` to the `AvailableWorkflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "subType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailableWorkflow" ADD COLUMN     "subType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "metaData" JSONB,
ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "metaData" JSONB,
ADD COLUMN     "refreshToken" TEXT;
