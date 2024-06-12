/*
  Warnings:

  - Added the required column `type` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `type` VARCHAR(100) NOT NULL;
