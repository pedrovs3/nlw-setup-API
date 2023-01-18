/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `tbl_days` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tbl_days_date_key` ON `tbl_days`(`date`);
