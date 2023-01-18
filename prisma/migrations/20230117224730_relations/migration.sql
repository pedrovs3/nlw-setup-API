-- AddForeignKey
ALTER TABLE `tbl_habit_week_days` ADD CONSTRAINT `tbl_habit_week_days_habit_id_fkey` FOREIGN KEY (`habit_id`) REFERENCES `tbl_habits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_days_habits` ADD CONSTRAINT `tbl_days_habits_day_id_fkey` FOREIGN KEY (`day_id`) REFERENCES `tbl_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_days_habits` ADD CONSTRAINT `tbl_days_habits_habit_id_fkey` FOREIGN KEY (`habit_id`) REFERENCES `tbl_habits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
