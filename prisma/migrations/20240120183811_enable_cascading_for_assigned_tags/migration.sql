BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Assignment] DROP CONSTRAINT [Assignment_PHDTagId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Record] DROP CONSTRAINT [Record_timestamp_df];
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_timestamp_df] DEFAULT getdate() FOR [timestamp];

-- AddForeignKey
ALTER TABLE [dbo].[Assignment] ADD CONSTRAINT [Assignment_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
