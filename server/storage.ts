import { type User, type InsertUser, type Booking, type InsertBooking } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add some sample bookings for demo
    const sampleBookings: InsertBooking[] = [
      {
        clientName: "Sarah Mitchell",
        serviceType: "AI Consultation",
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "Confirmed",
        notes: "Initial consultation for AI implementation strategy",
      },
      {
        clientName: "David Chen",
        serviceType: "Automation Setup",
        bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "Confirmed",
        notes: "Setting up automated workflows for customer service",
      },
      {
        clientName: "Emma Rodriguez",
        serviceType: "Voice AI Demo",
        bookingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: "Pending",
        notes: "Demo of Vapi voice agent capabilities",
      },
    ];

    sampleBookings.forEach((booking) => {
      const id = randomUUID();
      const createdAt = new Date();
      this.bookings.set(id, { 
        ...booking, 
        id, 
        createdAt,
        notes: booking.notes ?? null,
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const createdAt = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt,
      notes: insertBooking.notes ?? null,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const existing = this.bookings.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.bookings.set(id, updated);
    return updated;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }
}

export const storage = new MemStorage();
