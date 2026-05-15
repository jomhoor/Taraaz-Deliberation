CREATE TABLE "sso_account" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sso_account_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"sso_subject" text NOT NULL,
	"client_id" varchar(100) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (0) DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "sso_account" ADD CONSTRAINT "sso_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sso_subject_client_active_unique" ON "sso_account" USING btree ("sso_subject","client_id") WHERE "sso_account"."is_deleted" = false;--> statement-breakpoint
CREATE INDEX "sso_subject_client_idx" ON "sso_account" USING btree ("sso_subject","client_id");
