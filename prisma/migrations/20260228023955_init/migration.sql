-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "sourceAmount" DOUBLE PRECISION NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "midMarketRate" DOUBLE PRECISION NOT NULL,
    "marginPercent" DOUBLE PRECISION NOT NULL,
    "flatFee" DOUBLE PRECISION NOT NULL,
    "totalReceived" DOUBLE PRECISION NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "deliveryMinutes" INTEGER,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyPair" (
    "id" TEXT NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "midMarketRate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyPair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Rate_sourceCurrency_targetCurrency_sourceAmount_idx" ON "Rate"("sourceCurrency", "targetCurrency", "sourceAmount");

-- CreateIndex
CREATE INDEX "Rate_providerId_idx" ON "Rate"("providerId");

-- CreateIndex
CREATE INDEX "Rate_fetchedAt_idx" ON "Rate"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyPair_sourceCurrency_targetCurrency_key" ON "CurrencyPair"("sourceCurrency", "targetCurrency");

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
