CREATE TABLE "instagram_reels" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instagram_reels_url_unique" UNIQUE("url")
);
--> statement-breakpoint
INSERT INTO "instagram_reels" ("url", "position") VALUES
	('https://www.instagram.com/reel/DbmJ-0Etbdz/', 0),
	('https://www.instagram.com/reel/DbrUEPhtyXz/', 1);
