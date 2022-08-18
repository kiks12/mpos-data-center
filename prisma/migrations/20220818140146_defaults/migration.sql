-- CreateTable
CREATE TABLE "Defaults" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Defaults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Defaults" ADD CONSTRAINT "Defaults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
