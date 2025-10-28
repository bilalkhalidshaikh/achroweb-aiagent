import { z } from "zod";

export interface VoiceLog {
  id: string;
  callId: string;
  clientName: string;
  transcript: string;
  sentiment: "positive" | "neutral" | "negative";
  duration: number; // in seconds
  outcome: "booking_created" | "inquiry" | "cancelled" | "rescheduled";
  createdAt: Date;
}

export const SENTIMENTS = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
} as const;

export const OUTCOMES = {
  BOOKING_CREATED: "booking_created",
  INQUIRY: "inquiry",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
} as const;

// Mock voice logs for demo
export const mockVoiceLogs: VoiceLog[] = [
  {
    id: "vl-001",
    callId: "call-abc123",
    clientName: "Jennifer Walsh",
    transcript: "Hi, I'd like to schedule an AI consultation for next week. I'm interested in implementing voice AI for my customer service team. Tuesday at 2 PM works great for me. Thank you!",
    sentiment: "positive",
    duration: 142,
    outcome: "booking_created",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "vl-002",
    callId: "call-def456",
    clientName: "Marcus Johnson",
    transcript: "Hello, I'm calling about your automation services. Can you tell me more about what you offer? I run an e-commerce business and need help with order processing automation.",
    sentiment: "neutral",
    duration: 98,
    outcome: "inquiry",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "vl-003",
    callId: "call-ghi789",
    clientName: "Lisa Chen",
    transcript: "Hi, I need to reschedule my appointment from Friday to next Monday at 3 PM. Something came up with a client meeting. Is that possible?",
    sentiment: "neutral",
    duration: 76,
    outcome: "rescheduled",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "vl-004",
    callId: "call-jkl012",
    clientName: "Robert Martinez",
    transcript: "Unfortunately, I need to cancel my booking for tomorrow. I won't be able to make it due to an emergency. I apologize for the short notice.",
    sentiment: "negative",
    duration: 54,
    outcome: "cancelled",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "vl-005",
    callId: "call-mno345",
    clientName: "Amanda Foster",
    transcript: "This is amazing! I'd love to book a voice AI demo for Thursday at 10 AM. I've heard great things about your Vapi integration and can't wait to see it in action!",
    sentiment: "positive",
    duration: 118,
    outcome: "booking_created",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];
