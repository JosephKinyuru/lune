import { pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { post } from "./post";

export const like = pgTable(
  "likes",
  {
    userId: varchar("user_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    postId: varchar("post_id", { length: 36 })
      .references(() => post.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    uniqueUserCourse: unique().on(table.userId, table.postId),
  }),
);
