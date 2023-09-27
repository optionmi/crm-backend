/*
  Warnings:

  - You are about to drop the column `leads_products_id` on the `leads` table. All the data in the column will be lost.
  - Added the required column `lead_id` to the `leads_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leads` DROP FOREIGN KEY `leads_leads_products_id_fkey`;

-- AlterTable
ALTER TABLE `leads` DROP COLUMN `leads_products_id`;

-- AlterTable
ALTER TABLE `leads_products` ADD COLUMN `lead_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `leads_products` ADD CONSTRAINT `leads_products_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
