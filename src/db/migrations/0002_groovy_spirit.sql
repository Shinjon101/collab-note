ALTER TABLE "documents" RENAME COLUMN "ownerId" TO "owner_id";--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_ownerId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;