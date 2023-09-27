-- AlterTable
ALTER TABLE `leads` ADD COLUMN `closed_date` DATETIME(3) NULL,
    ADD COLUMN `lost_reason` VARCHAR(191) NULL,
    ADD COLUMN `won_value` DOUBLE NULL;
