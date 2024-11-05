import { pgTable, varchar, uniqueIndex, unique } from "drizzle-orm/pg-core";
import { user } from "./user"; 

export const follow = pgTable(
  "follows",
  {
    followerId: varchar("follower_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    followingId: varchar("following_id", { length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    uniqueUserCourse: unique().on(table.followerId, table.followingId),
  }),
);