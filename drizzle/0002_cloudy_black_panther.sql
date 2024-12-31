DROP INDEX "users_github_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "github_id" TO "github_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_expires` integer;