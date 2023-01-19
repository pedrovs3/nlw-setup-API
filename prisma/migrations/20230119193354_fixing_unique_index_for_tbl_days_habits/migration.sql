/*
  Warnings:

  - A unique constraint covering the columns `[day_id,habit_id]` on the table `tbl_days_habits` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `tbl_days_date_idx` ON `tbl_days`;

-- DropIndex
-- DROP INDEX `tbl_days_habits_day_id_habit_id_id` ON `tbl_days_habits`;

-- CreateIndex
CREATE UNIQUE INDEX `tbl_days_habits_day_id_habit_id_key` ON `tbl_days_habits`(`day_id`, `habit_id`);
