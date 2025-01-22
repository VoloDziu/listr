ALTER TABLE `users_table` RENAME TO `lists_table`;--> statement-breakpoint
DROP INDEX `users_table_email_unique`;--> statement-breakpoint
ALTER TABLE `lists_table` DROP COLUMN `age`;--> statement-breakpoint
ALTER TABLE `lists_table` DROP COLUMN `email`;