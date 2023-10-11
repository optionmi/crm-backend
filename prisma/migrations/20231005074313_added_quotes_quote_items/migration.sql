-- AlterTable
ALTER TABLE `lead_emails` ADD COLUMN `status` ENUM('UNREAD', 'READ', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD';

-- CreateTable
CREATE TABLE `quotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salesperson_id` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `contact_person_id` INTEGER NOT NULL,
    `lead_id` INTEGER NOT NULL,
    `billing_address` VARCHAR(191) NOT NULL,
    `billing_country` VARCHAR(191) NOT NULL,
    `billing_state` VARCHAR(191) NOT NULL,
    `billing_city` VARCHAR(191) NOT NULL,
    `billing_postal_code` INTEGER NOT NULL,
    `shipping_address` VARCHAR(191) NOT NULL,
    `shipping_country` VARCHAR(191) NOT NULL,
    `shipping_state` VARCHAR(191) NOT NULL,
    `shipping_city` VARCHAR(191) NOT NULL,
    `shipping_postal_code` INTEGER NOT NULL,
    `sub_total` DECIMAL(65, 30) NOT NULL,
    `total_discount` DECIMAL(65, 30) NOT NULL,
    `total_tax` DECIMAL(65, 30) NOT NULL,
    `adjustment` DECIMAL(65, 30) NOT NULL,
    `grand_total` DECIMAL(65, 30) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote_id` INTEGER NOT NULL,
    `book_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `tax` DECIMAL(65, 30) NOT NULL,
    `total` DECIMAL(65, 30) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_salesperson_id_fkey` FOREIGN KEY (`salesperson_id`) REFERENCES `salespeople`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_contact_person_id_fkey` FOREIGN KEY (`contact_person_id`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_items` ADD CONSTRAINT `quote_items_quote_id_fkey` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
