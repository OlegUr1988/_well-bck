BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Record] DROP CONSTRAINT [Record_timestamp_df];
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_timestamp_df] DEFAULT getdate() FOR [timestamp];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
