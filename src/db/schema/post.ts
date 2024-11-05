import {
  pgTable,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./user"; 

export const post = pgTable("posts", {
  id: varchar("id", { length: 36 }).default("cuid_generate()").primaryKey(), 
  content: text("content").notNull(),
  userId: varchar("user_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" }) 
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
