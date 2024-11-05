import { pgTable, varchar, timestamp, uniqueIndex, unique } from "drizzle-orm/pg-core";
import { user } from "./user"; 
import { post } from "./post"; 

export const repost = pgTable(
  "reposts",
  {
    id: varchar("id", { length: 36 }).default("cuid_generate()").primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    postId: varchar("post_id", { length: 36 })
      .references(() => post.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserCourse: unique().on(table.userId, table.postId),
  }),
);