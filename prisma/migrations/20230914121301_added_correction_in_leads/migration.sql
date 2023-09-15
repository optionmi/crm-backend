/*
  Warnings:

  - You are about to drop the column `leads_contact_personId` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `leads_contact_person_Id` on the `leads` table. All the data in the column will be lost.
  - Added the required column `leads_contact_person_id` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leads` DROP FOREIGN KEY `leads_leads_contact_personId_fkey`;

-- AlterTable
ALTER TABLE `leads` DROP COLUMN `leads_contact_personId`,
    DROP COLUMN `leads_contact_person_Id`,
    ADD COLUMN `leads_contact_person_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_leads_contact_person_id_fkey` FOREIGN KEY (`leads_contact_person_id`) REFERENCES `leads_contact_person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
