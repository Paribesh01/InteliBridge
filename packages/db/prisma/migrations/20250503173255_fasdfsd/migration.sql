-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
