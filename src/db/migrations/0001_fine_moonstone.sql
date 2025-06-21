ALTER TABLE "documents" DROP CONSTRAINT "documents_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "ownerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "owner_id";