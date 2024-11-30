import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { post } from "./post";

export const reply = pgTable("replies", {
  id: varchar("id", { length: 36 }).default("cuid_generate()").primaryKey(),
  content: text("content").notNull(),
  userId: varchar("user_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  postId: varchar("post_id", { length: 36 })
    .references(() => post.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
