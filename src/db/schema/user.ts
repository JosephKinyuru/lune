import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), 
  username: varchar("username", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  githubId: varchar("github_id", { length: 255 }).unique(),
  avatar_url: varchar("avatar_url", { length: 255 }),
  dateOfBirth: timestamp("date_of_birth", { precision: 3 }),
  bio: text("bio"),
  website: varchar("website", { length: 255 }),
  is_Verified: boolean("is_Verified").default(false),
  isBanned: boolean("is_banned").default(false),
  isSuspended: boolean("is_suspended").default(false),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at", { precision: 3 }).defaultNow(),
  resetPasswordToken: varchar("reset_password_token", {
    length: 255,
  }),
});

uniqueIndex("user_username_unique").on(user.username);
uniqueIndex("user_email_unique").on(user.email);
uniqueIndex("user_google_id_unique").on(user.googleId);
uniqueIndex("user_github_id_unique").on(user.githubId);
