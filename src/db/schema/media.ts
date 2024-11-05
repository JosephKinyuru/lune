import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { post } from "./post";

export const mediaTypeEnum = pgEnum("media_type", ["IMAGE", "VIDEO"]);

export const media = pgTable("post_media", {
  id: varchar("id", { length: 36 }).default("cuid_generate()").primaryKey(),
  postId: varchar("post_id", { length: 36 }).references(() => post.id, {
    onDelete: "set null",
  }),
  type: mediaTypeEnum("media_type").notNull(),
  url: varchar("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
