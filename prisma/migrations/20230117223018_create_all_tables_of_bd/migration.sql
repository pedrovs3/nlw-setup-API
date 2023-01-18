-- CreateTable
CREATE TABLE `tbl_habit_week_days` (
    `id` VARCHAR(191) NOT NULL,
    `habit_id` VARCHAR(191) NOT NULL,
    `week_day` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_habit_week_days_habit_id_week_day_key`(`habit_id`, `week_day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_days` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `tbl_days_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_days_habits` (
    `id` VARCHAR(191) NOT NULL,
    `day_id` VARCHAR(191) NOT NULL,
    `habit_id` VARCHAR(191) NOT NULL,

    INDEX `tbl_days_habits_day_id_habit_id_idx`(`day_id`, `habit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
