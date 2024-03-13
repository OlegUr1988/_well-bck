BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Target] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productionTarget] DECIMAL(32,16) NOT NULL,
    [energyConsumptionTarget] DECIMAL(32,16) NOT NULL,
    [specificEnergyConsupmtionTarget] DECIMAL(32,16) NOT NULL,
    [CO2EmissionTarget] DECIMAL(32,16) NOT NULL,
    [assetId] INT NOT NULL,
    CONSTRAINT [Target_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Target_assetId_key] UNIQUE NONCLUSTERED ([assetId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Target] ADD CONSTRAINT [Target_assetId_fkey] FOREIGN KEY ([assetId]) REFERENCES [dbo].[Asset]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
