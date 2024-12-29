CREATE TABLE `rate_limit_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`rate_limit_id` integer NOT NULL,
	`user_agent` text,
	`browser` text,
	`browser_version` text,
	`os` text,
	`os_version` text,
	`device` text,
	`device_type` text,
	`ip` text,
	`time_between_attempts` integer,
	`country` text,
	`region` text,
	`city` text,
	`latitude` text,
	`longitude` text,
	`timezone` text,
	`isp` text,
	`asn` text,
	`is_proxy` integer DEFAULT 0,
	`is_vpn` integer DEFAULT 0,
	`is_tor` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`rate_limit_id`) REFERENCES `rate_limits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`identifier` text NOT NULL,
	`config_key` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_attempt` text DEFAULT CURRENT_TIMESTAMP,
	`reset_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;