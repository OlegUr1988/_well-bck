BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Asset] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Asset_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Asset_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Equipment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [assetId] INT NOT NULL,
    CONSTRAINT [Equipment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Equipment_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[QueryType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [link] VARCHAR(255),
    CONSTRAINT [QueryType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [QueryType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Query] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [queryTypeId] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Query_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Query_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Query_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Equipment] ADD CONSTRAINT [Equipment_assetId_fkey] FOREIGN KEY ([assetId]) REFERENCES [dbo].[Asset]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Query] ADD CONSTRAINT [Query_queryTypeId_fkey] FOREIGN KEY ([queryTypeId]) REFERENCES [dbo].[QueryType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
