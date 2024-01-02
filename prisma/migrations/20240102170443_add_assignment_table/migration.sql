/*
  Warnings:

  - You are about to drop the column `partParameterId` on the `PHDTag` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[PHDTag] DROP CONSTRAINT [PHDTag_partParameterId_fkey];

-- AlterTable
ALTER TABLE [dbo].[PHDTag] DROP COLUMN [partParameterId];

-- CreateTable
CREATE TABLE [dbo].[Assignment] (
    [partParameterId] INT NOT NULL,
    [PHDTagId] INT NOT NULL,
    CONSTRAINT [Assignment_pkey] PRIMARY KEY CLUSTERED ([partParameterId],[PHDTagId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Assignment] ADD CONSTRAINT [Assignment_partParameterId_fkey] FOREIGN KEY ([partParameterId]) REFERENCES [dbo].[PartParameter]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Assignment] ADD CONSTRAINT [Assignment_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
