import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table for authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles for detailed information
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  fullName: text("full_name").notNull(),
  displayName: text("display_name"),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // 'male', 'female', 'non_binary', 'prefer_not_to_say'
  location: text("location"),
  bio: text("bio"),
  interests: text("interests").array(),
  occupation: text("occupation"),
  education: text("education"),
  height: integer("height"), // in cm
  profileVideoUrl: text("profile_video_url"),
  profileImages: text("profile_images").array(),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  lastActive: timestamp("last_active").defaultNow(),
  subscriptionTier: text("subscription_tier").default('free'), // 'free', 'premium', 'vip'
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences for matching
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  preferredGender: text("preferred_gender").array(),
  minAge: integer("min_age").default(18),
  maxAge: integer("max_age").default(50),
  maxDistance: integer("max_distance").default(50), // km
  showMeOnDiscovery: boolean("show_me_on_discovery").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Matches between users
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  user1Id: uuid("user1_id").references(() => users.id).notNull(),
  user2Id: uuid("user2_id").references(() => users.id).notNull(),
  status: text("status").default('pending'), // 'pending', 'matched', 'rejected', 'blocked'
  matchedAt: timestamp("matched_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Swipe actions
export const swipeActions = pgTable("swipe_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  swiperId: uuid("swiper_id").references(() => users.id).notNull(),
  swipedId: uuid("swiped_id").references(() => users.id).notNull(),
  isLike: boolean("is_like").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  receiverId: uuid("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default('text'), // 'text', 'image', 'video', 'gif'
  mediaUrl: text("media_url"),
  status: text("status").default('sent'), // 'sent', 'delivered', 'read'
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Match Ratings and Feedback
export const matchRatings = pgTable("match_ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  raterId: uuid("rater_id").references(() => users.id).notNull(),
  ratedUserId: uuid("rated_user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 scale
  feedback: text("feedback"),
  categories: text("categories").array(), // e.g., ['conversation', 'photos', 'compatibility']
  wouldRecommend: boolean("would_recommend"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSwipeActionSchema = createInsertSchema(swipeActions).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchRatingSchema = createInsertSchema(matchRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type Match = typeof matches.$inferSelect;
export type SwipeAction = typeof swipeActions.$inferSelect;
export type InsertSwipeAction = z.infer<typeof insertSwipeActionSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type MatchRating = typeof matchRatings.$inferSelect;
export type InsertMatchRating = z.infer<typeof insertMatchRatingSchema>;
