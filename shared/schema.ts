import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  serviceType: text("service_type").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  bookingDate: z.coerce.date(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const BOOKING_STATUSES = {
  CONFIRMED: "Confirmed",
  RESCHEDULED: "Rescheduled",
  CANCELED: "Canceled",
  PENDING: "Pending",
} as const;

export const SERVICE_TYPES = {
  AI_CONSULTATION: "AI Consultation",
  AUTOMATION_SETUP: "Automation Setup",
  VOICE_AI_DEMO: "Voice AI Demo",
  CUSTOM_INTEGRATION: "Custom Integration",
  STRATEGY_SESSION: "Strategy Session",
} as const;
