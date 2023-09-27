/*
  Warnings:

  - You are about to drop the column `total_amount` on the `leads_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `leads` ADD COLUMN `total_amount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `leads_products` DROP COLUMN `total_amount`;
