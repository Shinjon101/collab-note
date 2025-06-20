import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const documentCollaborators = pgTable(
  "document_collaborators",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["read", "edit"] }).notNull(),
  },
  (table) => ({
    uniqueCollaborator: unique().on(table.documentId, table.userId),
  })
);

export const documentsRelations = relations(documents, ({ one }) => ({
  owner: one(users, {
    fields: [documents.ownerId],
    references: [users.id],
  }),
}));

export const documentCollaboratorsRelations = relations(
  documentCollaborators,
  ({ one }) => ({
    user: one(users, {
      fields: [documentCollaborators.userId],
      references: [users.id],
    }),
    document: one(documents, {
      fields: [documentCollaborators.documentId],
      references: [documents.id],
    }),
  })
);
