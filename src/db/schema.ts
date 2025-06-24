import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// User Table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
});

// Documents Table
export const documents = pgTable("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // ✅ text ID for Liveblocks
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

// userRooms = access control per room
export const userRooms = pgTable(
  "user_rooms",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roomId: text("room_id") // ✅ MATCHES documents.id
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["read", "edit"] }).notNull(),
  },
  (table) => ({
    uniqueUserRoom: unique().on(table.userId, table.roomId),
  })
);

// documentCollaborators - old style, now fixed
export const documentCollaborators = pgTable(
  "document_collaborators",
  {
    id: serial("id").primaryKey(),
    documentId: text("document_id") // ✅ CHANGED from integer to text
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

// Relations
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

export const userRoomsRelations = relations(userRooms, ({ one }) => ({
  user: one(users, {
    fields: [userRooms.userId],
    references: [users.id],
  }),
  document: one(documents, {
    fields: [userRooms.roomId],
    references: [documents.id],
  }),
}));
