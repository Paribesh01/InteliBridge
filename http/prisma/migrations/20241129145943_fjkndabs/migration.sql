-- CreateTable
CREATE TABLE "WebhookZap" (
    "id" TEXT NOT NULL,
    "zapId" TEXT NOT NULL,

    CONSTRAINT "WebhookZap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookZap" ADD CONSTRAINT "WebhookZap_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
