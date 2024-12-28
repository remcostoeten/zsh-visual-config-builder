DROP INDEX "users_github_id_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "email" TO "email" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);