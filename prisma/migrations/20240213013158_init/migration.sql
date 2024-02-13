-- CreateTable
CREATE TABLE "Censo" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "Censo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Censo_year_key" ON "Censo"("year");
