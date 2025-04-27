ALTER TABLE "computer_labs" ADD COLUMN "computer_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "computer_labs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "computer_labs" ADD COLUMN "created_at" timestamp with time zone NOT NULL;