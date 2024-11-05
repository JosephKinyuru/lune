import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./user"; 

export const resetPasswordToken = pgTable("reset_password_tokens", {
  id: serial("id").primaryKey(), 
  userId: varchar("user_id", { length: 36 })
    .references(() => user.id, { onDelete: "cascade" }) 
    .notNull()
    .unique(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  tokenExpiresAt: timestamp("token_expires_at", { precision: 3 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(), 
  otpExpiresAt: timestamp("otp_expires_at", { precision: 3 }).notNull(),
  lastUpdatedAt: timestamp("last_updated_at", { precision: 3 }).defaultNow(),
});

export const verifyEmailToken = pgTable("verify_email_tokens", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  tokenExpiresAt: timestamp("token_expires_at", { precision: 3 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  otpExpiresAt: timestamp("otp_expires_at", { precision: 3 }).notNull(),
  lastUpdatedAt: timestamp("last_updated_at", { precision: 3 }).defaultNow(),
});

uniqueIndex("reset_password_userId_unique").on(resetPasswordToken.userId);

