/*
  Warnings:

  - Added the required column `PHDTagTypeId` to the `PHDTag` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[PHDTag] ADD [PHDTagTypeId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[PHDTagType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [PHDTagType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PHDTagType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_PHDTagTypeId_fkey] FOREIGN KEY ([PHDTagTypeId]) REFERENCES [dbo].[PHDTagType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
