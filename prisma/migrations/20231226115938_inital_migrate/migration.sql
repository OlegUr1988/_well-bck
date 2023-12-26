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
CREATE TABLE [dbo].[Part] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [equipmentId] INT NOT NULL,
    CONSTRAINT [Part_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Part_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PartLoss] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [partId] INT NOT NULL,
    CONSTRAINT [PartLoss_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PartLoss_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Unit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Unit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Unit_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PHDTag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tagname] VARCHAR(300) NOT NULL,
    [partLossId] INT NOT NULL,
    [unitId] INT NOT NULL,
    CONSTRAINT [PHDTag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PHDTag_tagname_key] UNIQUE NONCLUSTERED ([tagname])
);

-- CreateTable
CREATE TABLE [dbo].[Loss] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] DECIMAL(32,16) NOT NULL,
    [PHDTagId] INT NOT NULL,
    [timestamp] DATETIME2 NOT NULL,
    CONSTRAINT [Loss_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UsefulWork] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] DECIMAL(32,16) NOT NULL,
    [PHDTagId] INT NOT NULL,
    [timestamp] DATETIME2 NOT NULL,
    CONSTRAINT [UsefulWork_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Equipment] ADD CONSTRAINT [Equipment_assetId_fkey] FOREIGN KEY ([assetId]) REFERENCES [dbo].[Asset]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Part] ADD CONSTRAINT [Part_equipmentId_fkey] FOREIGN KEY ([equipmentId]) REFERENCES [dbo].[Equipment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PartLoss] ADD CONSTRAINT [PartLoss_partId_fkey] FOREIGN KEY ([partId]) REFERENCES [dbo].[Part]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_partLossId_fkey] FOREIGN KEY ([partLossId]) REFERENCES [dbo].[PartLoss]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_unitId_fkey] FOREIGN KEY ([unitId]) REFERENCES [dbo].[Unit]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Loss] ADD CONSTRAINT [Loss_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UsefulWork] ADD CONSTRAINT [UsefulWork_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
