-- DropForeignKey
ALTER TABLE `leads` DROP FOREIGN KEY `leads_leads_contact_person_id_fkey`;

-- AlterTable
ALTER TABLE `leads` MODIFY `leads_contact_person_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_leads_contact_person_id_fkey` FOREIGN KEY (`leads_contact_person_id`) REFERENCES `leads_contact_person`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
