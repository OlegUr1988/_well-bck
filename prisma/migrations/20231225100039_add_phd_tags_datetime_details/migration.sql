/*
  Warnings:

  - Added the required column `updated_at` to the `PHDTag` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[PHDTag] ADD [created_at] DATETIME2 NOT NULL CONSTRAINT [PHDTag_created_at_df] DEFAULT CURRENT_TIMESTAMP,
[updated_at] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
