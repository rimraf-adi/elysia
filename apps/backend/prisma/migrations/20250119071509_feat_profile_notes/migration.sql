-- CreateTable
CREATE TABLE "ProfileNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileNote_userId_idx" ON "ProfileNote"("userId");

-- CreateIndex
CREATE INDEX "ProfileNote_createdAt_idx" ON "ProfileNote"("createdAt");

-- AddForeignKey
ALTER TABLE "ProfileNote" ADD CONSTRAINT "ProfileNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
