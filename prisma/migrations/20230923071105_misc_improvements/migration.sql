/*
  Warnings:

  - You are about to drop the column `leads_contact_person_id` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the `leads_contact_person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leads_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `leads` DROP FOREIGN KEY `leads_leads_contact_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `leads_contact_person` DROP FOREIGN KEY `leads_contact_person_contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `leads_contact_person` DROP FOREIGN KEY `leads_contact_person_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `leads_products` DROP FOREIGN KEY `leads_products_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `leads_products` DROP FOREIGN KEY `leads_products_lead_id_fkey`;

-- AlterTable
ALTER TABLE `leads` DROP COLUMN `leads_contact_person_id`,
    ADD COLUMN `lead_contact_person_id` INTEGER NULL;

-- DropTable
DROP TABLE `leads_contact_person`;

-- DropTable
DROP TABLE `leads_products`;

-- CreateTable
CREATE TABLE `lead_contact_person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `lead_id` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_lead_contact_person_id_fkey` FOREIGN KEY (`lead_contact_person_id`) REFERENCES `lead_contact_person`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_contact_person` ADD CONSTRAINT `lead_contact_person_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_contact_person` ADD CONSTRAINT `lead_contact_person_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_products` ADD CONSTRAINT `lead_products_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_products` ADD CONSTRAINT `lead_products_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
