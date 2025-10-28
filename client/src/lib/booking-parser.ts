import { add, parse, isToday, isTomorrow, nextDay, setHours, setMinutes } from "date-fns";
import type { InsertBooking } from "@shared/schema";
import { BOOKING_STATUSES, SERVICE_TYPES } from "@shared/schema";

export function parseBookingInput(input: string): InsertBooking | null {
  try {
    const lowerInput = input.toLowerCase();
    
    // Extract client name (look for "for [name]" pattern)
    const nameMatch = input.match(/(?:book|schedule|create)(?:\s+a\s+booking)?\s+for\s+([a-z]+(?:\s+[a-z]+)?)/i);
    if (!nameMatch) return null;
    const clientName = nameMatch[1].trim();

    // Extract service type
    let serviceType = SERVICE_TYPES.AI_CONSULTATION; // default
    if (lowerInput.includes("automation")) {
      serviceType = SERVICE_TYPES.AUTOMATION_SETUP;
    } else if (lowerInput.includes("voice") || lowerInput.includes("demo")) {
      serviceType = SERVICE_TYPES.VOICE_AI_DEMO;
    } else if (lowerInput.includes("integration")) {
      serviceType = SERVICE_TYPES.CUSTOM_INTEGRATION;
    } else if (lowerInput.includes("strategy")) {
      serviceType = SERVICE_TYPES.STRATEGY_SESSION;
    }

    // Extract time
    const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (!timeMatch) return null;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3].toLowerCase();
    
    if (meridiem === "pm" && hours !== 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    // Extract date
    let bookingDate = new Date();
    
    if (lowerInput.includes("tomorrow")) {
      bookingDate = add(new Date(), { days: 1 });
    } else if (lowerInput.includes("today")) {
      bookingDate = new Date();
    } else {
      // Check for day of week
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      for (let i = 0; i < days.length; i++) {
        if (lowerInput.includes(days[i])) {
          bookingDate = nextDay(new Date(), i + 1);
          break;
        }
      }
      
      // Check for specific date pattern (e.g., "on March 15" or "on 15th")
      const dateMatch = input.match(/on\s+(?:(\w+)\s+)?(\d{1,2})(?:st|nd|rd|th)?/i);
      if (dateMatch) {
        const day = parseInt(dateMatch[2]);
        const month = dateMatch[1];
        
        if (month) {
          const monthNames = ["january", "february", "march", "april", "may", "june", 
                            "july", "august", "september", "october", "november", "december"];
          const monthIndex = monthNames.findIndex(m => m.startsWith(month.toLowerCase()));
          if (monthIndex !== -1) {
            bookingDate = new Date(new Date().getFullYear(), monthIndex, day);
          }
        } else {
          // Just a day number, assume current or next month
          bookingDate = new Date(new Date().getFullYear(), new Date().getMonth(), day);
          if (bookingDate < new Date()) {
            bookingDate = add(bookingDate, { months: 1 });
          }
        }
      }
    }

    bookingDate = setHours(setMinutes(bookingDate, minutes), hours);

    return {
      clientName,
      serviceType,
      bookingDate,
      status: BOOKING_STATUSES.CONFIRMED,
      notes: input,
    };
  } catch (error) {
    console.error("Error parsing booking input:", error);
    return null;
  }
}
