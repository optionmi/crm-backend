-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `organization_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
