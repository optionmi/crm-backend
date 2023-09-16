/*
  Warnings:

  - You are about to drop the column `item_name` on the `leads_products` table. All the data in the column will be lost.
  - Added the required column `book_id` to the `leads_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact_numbers` ADD COLUMN `label` ENUM('HOME', 'WORK') NOT NULL DEFAULT 'WORK';

-- AlterTable
ALTER TABLE `emails` ADD COLUMN `label` ENUM('HOME', 'WORK') NOT NULL DEFAULT 'WORK';

-- AlterTable
ALTER TABLE `leads_products` DROP COLUMN `item_name`,
    ADD COLUMN `book_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `leads_products` ADD CONSTRAINT `leads_products_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
