import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserProfileSchema,
  insertSwipeActionSchema,
  insertMessageSchema
} from "@shared/schema";
import { z } from "zod";

// Session type extension
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
      });

      // Create session
      req.session.userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ error: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create session
      req.session.userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error: any) {
      console.error("Signin error:", error);
      res.status(400).json({ error: error.message || "Signin failed" });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not sign out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Profile routes
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.session.userId!);
      res.json({ profile });
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.post("/api/profile", requireAuth, async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId: req.session.userId!,
      });
      
      const profile = await storage.createUserProfile(profileData);
      res.json({ profile });
    } catch (error: any) {
      console.error("Create profile error:", error);
      res.status(400).json({ error: error.message || "Failed to create profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      await storage.updateUserProfile(req.session.userId!, req.body);
      const profile = await storage.getUserProfile(req.session.userId!);
      res.json({ profile });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Discovery routes
  app.get("/api/discovery", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const profiles = await storage.getDiscoveryProfiles(req.session.userId!, limit);
      res.json({ profiles });
    } catch (error: any) {
      console.error("Discovery error:", error);
      res.status(500).json({ error: "Failed to get discovery profiles" });
    }
  });

  // Swipe routes
  app.post("/api/swipe", requireAuth, async (req, res) => {
    try {
      const swipeData = insertSwipeActionSchema.parse({
        ...req.body,
        swiperId: req.session.userId!,
      });
      
      const swipe = await storage.recordSwipeAction(swipeData);
      
      // Check for mutual match if it's a like
      let match = null;
      if (swipe.isLike) {
        const isMutualMatch = await storage.checkMutualMatch(
          swipe.swiperId, 
          swipe.swipedId
        );
        
        if (isMutualMatch) {
          match = await storage.createMatch(swipe.swiperId, swipe.swipedId);
        }
      }
      
      res.json({ swipe, match });
    } catch (error: any) {
      console.error("Swipe error:", error);
      res.status(400).json({ error: error.message || "Failed to record swipe" });
    }
  });

  // Matches routes
  app.get("/api/matches", requireAuth, async (req, res) => {
    try {
      const matches = await storage.getUserMatches(req.session.userId!);
      res.json({ matches });
    } catch (error: any) {
      console.error("Get matches error:", error);
      res.status(500).json({ error: "Failed to get matches" });
    }
  });

  // Messages routes
  app.get("/api/matches/:matchId/messages", requireAuth, async (req, res) => {
    try {
      const { matchId } = req.params;
      const messages = await storage.getMatchMessages(matchId);
      res.json({ messages });
    } catch (error: any) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/matches/:matchId/messages", requireAuth, async (req, res) => {
    try {
      const { matchId } = req.params;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        matchId,
        senderId: req.session.userId!,
      });
      
      const message = await storage.sendMessage(messageData);
      res.json({ message });
    } catch (error: any) {
      console.error("Send message error:", error);
      res.status(400).json({ error: error.message || "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
