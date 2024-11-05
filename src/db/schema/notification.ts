import { pgTable, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { user } from "./user";
import { post } from "./post";

export const notificationTypeEnum = pgEnum("notification_type", [
  "LIKE",
  "FOLLOW",
  "COMMENT",
  "REPOST",
]);

export const notification = pgTable("notifications", {
  id: varchar("id", { length: 36 }).default("cuid_generate()").primaryKey(),
  recipientId: varchar("recipient_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  issuerId: varchar("issuer_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  postId: varchar("post_id", { length: 36 }).references(() => post.id, {
    onDelete: "cascade",
  }),
  type: notificationTypeEnum("notification_type").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
