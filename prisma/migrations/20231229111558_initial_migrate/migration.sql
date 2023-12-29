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
    CONSTRAINT [Part_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ParameterType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [ParameterType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ParameterType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PartParameter] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [partId] INT NOT NULL,
    [parameterTypeId] INT NOT NULL,
    CONSTRAINT [PartParameter_pkey] PRIMARY KEY CLUSTERED ([id])
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
    [partParameterId] INT NOT NULL,
    [unitId] INT NOT NULL,
    CONSTRAINT [PHDTag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PHDTag_tagname_key] UNIQUE NONCLUSTERED ([tagname])
);

-- CreateTable
CREATE TABLE [dbo].[Record] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] DECIMAL(32,16) NOT NULL,
    [PHDTagId] INT NOT NULL,
    [timestamp] DATETIME2 NOT NULL,
    CONSTRAINT [Record_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Equipment] ADD CONSTRAINT [Equipment_assetId_fkey] FOREIGN KEY ([assetId]) REFERENCES [dbo].[Asset]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Part] ADD CONSTRAINT [Part_equipmentId_fkey] FOREIGN KEY ([equipmentId]) REFERENCES [dbo].[Equipment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PartParameter] ADD CONSTRAINT [PartParameter_partId_fkey] FOREIGN KEY ([partId]) REFERENCES [dbo].[Part]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PartParameter] ADD CONSTRAINT [PartParameter_parameterTypeId_fkey] FOREIGN KEY ([parameterTypeId]) REFERENCES [dbo].[ParameterType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_partParameterId_fkey] FOREIGN KEY ([partParameterId]) REFERENCES [dbo].[PartParameter]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_unitId_fkey] FOREIGN KEY ([unitId]) REFERENCES [dbo].[Unit]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
