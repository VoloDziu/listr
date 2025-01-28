PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_todos_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`listId` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_todos_table`("id", "name", "listId", "completed") SELECT "id", "name", "listId", "completed" FROM `todos_table`;--> statement-breakpoint
DROP TABLE `todos_table`;--> statement-breakpoint
ALTER TABLE `__new_todos_table` RENAME TO `todos_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `lists_table` ADD `archivedAt` text DEFAULT (current_timestamp) NOT NULL;--> statement-breakpoint
ALTER TABLE `lists_table` ADD `parentList` integer;