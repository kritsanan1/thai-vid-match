import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, desc, asc } from "drizzle-orm";
import { 
  users, 
  userProfiles, 
  userPreferences, 
  matches, 
  swipeActions, 
  messages,
  matchRatings,
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type UserPreferences,
  type InsertUserPreferences,
  type Match,
  type SwipeAction,
  type InsertSwipeAction,
  type Message,
  type InsertMessage,
  type MatchRating,
  type InsertMatchRating
} from "@shared/schema";

// Database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export interface IStorage {
  // User management
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: string, isVerified: boolean): Promise<void>;
  
  // User profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<void>;
  
  // Discovery and matching
  getDiscoveryProfiles(userId: string, limit?: number): Promise<UserProfile[]>;
  recordSwipeAction(action: InsertSwipeAction): Promise<SwipeAction>;
  checkMutualMatch(user1Id: string, user2Id: string): Promise<boolean>;
  createMatch(user1Id: string, user2Id: string): Promise<Match>;
  
  // Matches and messages
  getUserMatches(userId: string): Promise<Match[]>;
  getMatchMessages(matchId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string, userId: string): Promise<void>;
  
  // Match ratings and feedback
  createMatchRating(rating: InsertMatchRating): Promise<MatchRating>;
  getMatchRating(matchId: string, raterId: string): Promise<MatchRating | undefined>;
  updateMatchRating(ratingId: string, updates: Partial<MatchRating>): Promise<void>;
  getUserRatingHistory(userId: string): Promise<MatchRating[]>;
  getAverageUserRating(userId: string): Promise<number>;
  getRatingsByCategories(userId: string): Promise<Record<string, number>>;
  
  // Safe Mode methods
  toggleSafeMode(userId: string, enabled: boolean): Promise<void>;
  getSafeModeStatus(userId: string): Promise<{ enabled: boolean; activatedAt?: Date; reminderInterval: number }>;
  updateSafeModeReminderInterval(userId: string, intervalDays: number): Promise<void>;
  markSafeModeReminderSent(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<void> {
    await db.update(users).set({ isVerified }).where(eq(users.id, id));
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result[0];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    return result[0];
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const result = await db.insert(userPreferences).values(preferences).returning();
    return result[0];
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<void> {
    await db.update(userPreferences).set(updates).where(eq(userPreferences.userId, userId));
  }

  async getDiscoveryProfiles(userId: string, limit = 10): Promise<UserProfile[]> {
    // Get profiles excluding users already swiped and the current user
    const swipedUserIds = await db
      .select({ swipedId: swipeActions.swipedId })
      .from(swipeActions)
      .where(eq(swipeActions.swiperId, userId));
    
    const excludeIds = [userId, ...swipedUserIds.map(s => s.swipedId)];
    
    const result = await db
      .select()
      .from(userProfiles)
      .where(and(
        eq(userProfiles.isActive, true),
        // This would be more complex with proper SQL, for now simplified
      ))
      .limit(limit);
    
    return result.filter(profile => !excludeIds.includes(profile.userId));
  }

  async recordSwipeAction(action: InsertSwipeAction): Promise<SwipeAction> {
    const result = await db.insert(swipeActions).values(action).returning();
    return result[0];
  }

  async checkMutualMatch(user1Id: string, user2Id: string): Promise<boolean> {
    const swipe1 = await db
      .select()
      .from(swipeActions)
      .where(and(
        eq(swipeActions.swiperId, user1Id),
        eq(swipeActions.swipedId, user2Id),
        eq(swipeActions.isLike, true)
      ))
      .limit(1);
    
    const swipe2 = await db
      .select()
      .from(swipeActions)
      .where(and(
        eq(swipeActions.swiperId, user2Id),
        eq(swipeActions.swipedId, user1Id),
        eq(swipeActions.isLike, true)
      ))
      .limit(1);
    
    return swipe1.length > 0 && swipe2.length > 0;
  }

  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const result = await db.insert(matches).values({
      user1Id: user1Id < user2Id ? user1Id : user2Id,
      user2Id: user1Id < user2Id ? user2Id : user1Id,
      status: 'matched',
      matchedAt: new Date(),
    }).returning();
    return result[0];
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    const result = await db
      .select()
      .from(matches)
      .where(and(
        eq(matches.status, 'matched'),
        // User is either user1 or user2
      ))
      .orderBy(desc(matches.matchedAt));
    
    return result.filter(match => match.user1Id === userId || match.user2Id === userId);
  }

  async getMatchMessages(matchId: string): Promise<Message[]> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));
    return result;
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ status: 'read', readAt: new Date() })
      .where(and(
        eq(messages.id, messageId),
        eq(messages.receiverId, userId)
      ));
  }

  async createMatchRating(rating: InsertMatchRating): Promise<MatchRating> {
    const result = await db.insert(matchRatings).values(rating).returning();
    return result[0];
  }

  async getMatchRating(matchId: string, raterId: string): Promise<MatchRating | undefined> {
    const result = await db
      .select()
      .from(matchRatings)
      .where(and(
        eq(matchRatings.matchId, matchId),
        eq(matchRatings.raterId, raterId)
      ))
      .limit(1);
    return result[0];
  }

  async updateMatchRating(ratingId: string, updates: Partial<MatchRating>): Promise<void> {
    await db.update(matchRatings).set(updates).where(eq(matchRatings.id, ratingId));
  }

  async getUserRatingHistory(userId: string): Promise<MatchRating[]> {
    const result = await db
      .select()
      .from(matchRatings)
      .where(eq(matchRatings.raterId, userId))
      .orderBy(desc(matchRatings.createdAt));
    return result;
  }

  async getAverageUserRating(userId: string): Promise<number> {
    const ratings = await db
      .select({ rating: matchRatings.rating })
      .from(matchRatings)
      .where(eq(matchRatings.ratedUserId, userId));
    
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  }

  async getRatingsByCategories(userId: string): Promise<Record<string, number>> {
    const ratings = await db
      .select({ categories: matchRatings.categories, rating: matchRatings.rating })
      .from(matchRatings)
      .where(eq(matchRatings.ratedUserId, userId));
    
    const categoryRatings: Record<string, number[]> = {};
    
    ratings.forEach(r => {
      if (r.categories) {
        r.categories.forEach(category => {
          if (!categoryRatings[category]) categoryRatings[category] = [];
          categoryRatings[category].push(r.rating);
        });
      }
    });
    
    const result: Record<string, number> = {};
    Object.entries(categoryRatings).forEach(([category, values]) => {
      result[category] = values.reduce((acc, val) => acc + val, 0) / values.length;
    });
    
    return result;
  }

  // Safe Mode methods
  async toggleSafeMode(userId: string, enabled: boolean): Promise<void> {
    const now = new Date();
    await db
      .update(userPreferences)
      .set({
        safeModeEnabled: enabled,
        safeModeActivatedAt: enabled ? now : null,
        updatedAt: now,
      })
      .where(eq(userPreferences.userId, userId));
  }

  async getSafeModeStatus(userId: string): Promise<{ enabled: boolean; activatedAt?: Date; reminderInterval: number }> {
    const [result] = await db
      .select({
        safeModeEnabled: userPreferences.safeModeEnabled,
        safeModeActivatedAt: userPreferences.safeModeActivatedAt,
        safeModeReminderInterval: userPreferences.safeModeReminderInterval,
      })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    return {
      enabled: result?.safeModeEnabled || false,
      activatedAt: result?.safeModeActivatedAt || undefined,
      reminderInterval: result?.safeModeReminderInterval || 7,
    };
  }

  async updateSafeModeReminderInterval(userId: string, intervalDays: number): Promise<void> {
    await db
      .update(userPreferences)
      .set({
        safeModeReminderInterval: intervalDays,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId));
  }

  async markSafeModeReminderSent(userId: string): Promise<void> {
    await db
      .update(userPreferences)
      .set({
        lastSafeModeReminder: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId));
  }
}

// For development, we'll use in-memory storage initially
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, UserProfile> = new Map();
  private preferences: Map<string, UserPreferences> = new Map();
  private matches: Map<string, Match> = new Map();
  private swipes: Map<string, SwipeAction> = new Map();
  private messages: Map<string, Message> = new Map();
  private ratings: Map<string, MatchRating> = new Map();

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const newUser: User = {
      id,
      ...user,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.isVerified = isVerified;
      user.updatedAt = new Date();
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = crypto.randomUUID();
    const newProfile: UserProfile = {
      id,
      ...profile,
      displayName: profile.displayName || null,
      isVerified: false,
      isActive: true,
      lastActive: new Date(),
      subscriptionTier: 'free',
      subscriptionExpiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const profile = Array.from(this.profiles.values()).find(p => p.userId === userId);
    if (profile) {
      Object.assign(profile, updates, { updatedAt: new Date() });
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.preferences.values()).find(pref => pref.userId === userId);
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = crypto.randomUUID();
    const newPreferences: UserPreferences = {
      id,
      ...preferences,
      preferredGender: preferences.preferredGender || null,
      minAge: preferences.minAge || 18,
      maxAge: preferences.maxAge || 50,
      maxDistance: preferences.maxDistance || 50,
      showMeOnDiscovery: preferences.showMeOnDiscovery !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.preferences.set(id, newPreferences);
    return newPreferences;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<void> {
    const preferences = Array.from(this.preferences.values()).find(p => p.userId === userId);
    if (preferences) {
      Object.assign(preferences, updates, { updatedAt: new Date() });
    }
  }

  async getDiscoveryProfiles(userId: string, limit = 10): Promise<UserProfile[]> {
    const swipedIds = Array.from(this.swipes.values())
      .filter(swipe => swipe.swiperId === userId)
      .map(swipe => swipe.swipedId);
    
    return Array.from(this.profiles.values())
      .filter(profile => 
        profile.userId !== userId && 
        profile.isActive && 
        !swipedIds.includes(profile.userId)
      )
      .slice(0, limit);
  }

  async recordSwipeAction(action: InsertSwipeAction): Promise<SwipeAction> {
    const id = crypto.randomUUID();
    const newSwipe: SwipeAction = {
      id,
      ...action,
      createdAt: new Date(),
    };
    this.swipes.set(id, newSwipe);
    return newSwipe;
  }

  async checkMutualMatch(user1Id: string, user2Id: string): Promise<boolean> {
    const swipe1 = Array.from(this.swipes.values()).find(s => 
      s.swiperId === user1Id && s.swipedId === user2Id && s.isLike
    );
    const swipe2 = Array.from(this.swipes.values()).find(s => 
      s.swiperId === user2Id && s.swipedId === user1Id && s.isLike
    );
    return !!(swipe1 && swipe2);
  }

  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const id = crypto.randomUUID();
    const newMatch: Match = {
      id,
      user1Id: user1Id < user2Id ? user1Id : user2Id,
      user2Id: user1Id < user2Id ? user2Id : user1Id,
      status: 'matched',
      matchedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => 
        (match.user1Id === userId || match.user2Id === userId) && 
        match.status === 'matched'
      )
      .sort((a, b) => (b.matchedAt?.getTime() || 0) - (a.matchedAt?.getTime() || 0));
  }

  async getMatchMessages(matchId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const id = crypto.randomUUID();
    const newMessage: Message = {
      id,
      ...message,
      mediaUrl: message.mediaUrl || null,
      messageType: message.messageType || 'text',
      status: 'sent',
      readAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message && message.receiverId === userId) {
      message.status = 'read';
      message.readAt = new Date();
      message.updatedAt = new Date();
    }
  }

  async createMatchRating(rating: InsertMatchRating): Promise<MatchRating> {
    const id = crypto.randomUUID();
    const newRating: MatchRating = {
      id,
      ...rating,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.ratings.set(id, newRating);
    return newRating;
  }

  async getMatchRating(matchId: string, raterId: string): Promise<MatchRating | undefined> {
    return Array.from(this.ratings.values()).find(rating => 
      rating.matchId === matchId && rating.raterId === raterId
    );
  }

  async updateMatchRating(ratingId: string, updates: Partial<MatchRating>): Promise<void> {
    const rating = this.ratings.get(ratingId);
    if (rating) {
      Object.assign(rating, updates, { updatedAt: new Date() });
    }
  }

  async getUserRatingHistory(userId: string): Promise<MatchRating[]> {
    return Array.from(this.ratings.values())
      .filter(rating => rating.raterId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAverageUserRating(userId: string): Promise<number> {
    const userRatings = Array.from(this.ratings.values())
      .filter(rating => rating.ratedUserId === userId);
    
    if (userRatings.length === 0) return 0;
    const sum = userRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / userRatings.length;
  }

  async getRatingsByCategories(userId: string): Promise<Record<string, number>> {
    const userRatings = Array.from(this.ratings.values())
      .filter(rating => rating.ratedUserId === userId);
    
    const categoryRatings: Record<string, number[]> = {};
    
    userRatings.forEach(rating => {
      if (rating.categories) {
        rating.categories.forEach(category => {
          if (!categoryRatings[category]) categoryRatings[category] = [];
          categoryRatings[category].push(rating.rating);
        });
      }
    });
    
    const result: Record<string, number> = {};
    Object.entries(categoryRatings).forEach(([category, values]) => {
      result[category] = values.reduce((acc, val) => acc + val, 0) / values.length;
    });
    
    return result;
  }

  // Safe Mode methods - MemStorage implementation
  async toggleSafeMode(userId: string, enabled: boolean): Promise<void> {
    const userPrefs = this.preferences.get(userId);
    if (userPrefs) {
      userPrefs.safeModeEnabled = enabled;
      userPrefs.safeModeActivatedAt = enabled ? new Date() : undefined;
      userPrefs.updatedAt = new Date();
    }
  }

  async getSafeModeStatus(userId: string): Promise<{ enabled: boolean; activatedAt?: Date; reminderInterval: number }> {
    const userPrefs = this.preferences.get(userId);
    return {
      enabled: userPrefs?.safeModeEnabled || false,
      activatedAt: userPrefs?.safeModeActivatedAt,
      reminderInterval: userPrefs?.safeModeReminderInterval || 7,
    };
  }

  async updateSafeModeReminderInterval(userId: string, intervalDays: number): Promise<void> {
    const userPrefs = this.preferences.get(userId);
    if (userPrefs) {
      userPrefs.safeModeReminderInterval = intervalDays;
      userPrefs.updatedAt = new Date();
    }
  }

  async markSafeModeReminderSent(userId: string): Promise<void> {
    const userPrefs = this.preferences.get(userId);
    if (userPrefs) {
      userPrefs.lastSafeModeReminder = new Date();
      userPrefs.updatedAt = new Date();
    }
  }
}

export const storage = new DatabaseStorage();
