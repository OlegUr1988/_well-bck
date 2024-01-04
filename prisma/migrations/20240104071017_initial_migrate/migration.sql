BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Area] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [Area_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Area_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Asset] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [areaId] INT NOT NULL,
    CONSTRAINT [Asset_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Asset_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Equipment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [assetId] INT NOT NULL,
    CONSTRAINT [Equipment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AttributeType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [AttributeType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AttributeType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Attribute] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255) NOT NULL,
    [equipmentId] INT NOT NULL,
    [attributeTypeId] INT NOT NULL,
    CONSTRAINT [Attribute_pkey] PRIMARY KEY CLUSTERED ([id])
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
    [unitId] INT NOT NULL,
    CONSTRAINT [PHDTag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PHDTag_tagname_key] UNIQUE NONCLUSTERED ([tagname])
);

-- CreateTable
CREATE TABLE [dbo].[Assignment] (
    [attributeId] INT NOT NULL,
    [PHDTagId] INT NOT NULL,
    CONSTRAINT [Assignment_pkey] PRIMARY KEY CLUSTERED ([attributeId],[PHDTagId])
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
ALTER TABLE [dbo].[Asset] ADD CONSTRAINT [Asset_areaId_fkey] FOREIGN KEY ([areaId]) REFERENCES [dbo].[Area]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Equipment] ADD CONSTRAINT [Equipment_assetId_fkey] FOREIGN KEY ([assetId]) REFERENCES [dbo].[Asset]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Attribute] ADD CONSTRAINT [Attribute_equipmentId_fkey] FOREIGN KEY ([equipmentId]) REFERENCES [dbo].[Equipment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Attribute] ADD CONSTRAINT [Attribute_attributeTypeId_fkey] FOREIGN KEY ([attributeTypeId]) REFERENCES [dbo].[AttributeType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PHDTag] ADD CONSTRAINT [PHDTag_unitId_fkey] FOREIGN KEY ([unitId]) REFERENCES [dbo].[Unit]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Assignment] ADD CONSTRAINT [Assignment_attributeId_fkey] FOREIGN KEY ([attributeId]) REFERENCES [dbo].[Attribute]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Assignment] ADD CONSTRAINT [Assignment_PHDTagId_fkey] FOREIGN KEY ([PHDTagId]) REFERENCES [dbo].[PHDTag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
