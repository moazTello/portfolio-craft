-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Availability_portfolioId_idx" ON "Availability"("portfolioId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
