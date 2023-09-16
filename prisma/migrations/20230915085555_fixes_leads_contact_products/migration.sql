/*
  Warnings:

  - You are about to drop the column `lead_id` on the `leads_products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `leads_products` DROP FOREIGN KEY `leads_products_lead_id_fkey`;

-- AlterTable
ALTER TABLE `leads` ADD COLUMN `leads_products_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `leads_products` DROP COLUMN `lead_id`;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_leads_products_id_fkey` FOREIGN KEY (`leads_products_id`) REFERENCES `leads_products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
