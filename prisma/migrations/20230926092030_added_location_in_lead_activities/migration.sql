/*
  Warnings:

  - Added the required column `location` to the `lead_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lead_activities` ADD COLUMN `location` VARCHAR(191) NOT NULL;
