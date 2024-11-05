import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user"; 

export const session = pgTable("sessions", {
  id: varchar("id", { length: 36 }).primaryKey(), 
  userId: varchar("user_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" }) 
    .notNull(),
  expiresAt: timestamp("expires_at", { precision: 3 }).notNull(),
});
