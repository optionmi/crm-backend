/*
  Warnings:

  - Added the required column `address` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `postal_code` INTEGER NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;
