PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_lists_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`archivedAt` integer,
	`parentList` integer
);
--> statement-breakpoint
INSERT INTO `__new_lists_table`("id", "name", "archivedAt", "parentList") SELECT "id", "name", "archivedAt", "parentList" FROM `lists_table`;--> statement-breakpoint
DROP TABLE `lists_table`;--> statement-breakpoint
ALTER TABLE `__new_lists_table` RENAME TO `lists_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;