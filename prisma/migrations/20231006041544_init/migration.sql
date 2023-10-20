/*
  Warnings:

  - You are about to alter the column `price` on the `quote_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `quote_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `discount` on the `quote_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `tax` on the `quote_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `quote_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `sub_total` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_discount` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_tax` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `adjustment` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `grand_total` on the `quotes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `quote_items` MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `discount` DECIMAL(10, 2) NOT NULL,
    MODIFY `tax` DECIMAL(10, 2) NOT NULL,
    MODIFY `total` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `quotes` MODIFY `sub_total` DECIMAL(10, 2) NOT NULL,
    MODIFY `total_discount` DECIMAL(10, 2) NOT NULL,
    MODIFY `total_tax` DECIMAL(10, 2) NOT NULL,
    MODIFY `adjustment` DECIMAL(10, 2) NOT NULL,
    MODIFY `grand_total` DECIMAL(10, 2) NOT NULL;
