/*
  Warnings:

  - You are about to drop the column `actionType` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `inputData` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `outputData` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Zap` table. All the data in the column will be lost.
  - Added the required column `workflowId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workflow_zapId_index_key";

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "actionType",
DROP COLUMN "createdAt",
DROP COLUMN "inputData",
DROP COLUMN "outputData",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "workflowId" TEXT NOT NULL,
ALTER COLUMN "index" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableWorkflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "AvailableWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "AvailableTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_zapId_key" ON "Trigger"("zapId");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "AvailableWorkflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
