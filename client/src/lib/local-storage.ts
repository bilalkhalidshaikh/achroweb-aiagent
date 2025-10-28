import type { Booking } from "@shared/schema";

const BOOKINGS_KEY = "achroweb_bookings";

export const localStorageService = {
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(BOOKINGS_KEY);
      if (!data) return [];
      
      const bookings = JSON.parse(data);
      // Convert date strings back to Date objects
      return bookings.map((b: any) => ({
        ...b,
        bookingDate: new Date(b.bookingDate),
        createdAt: new Date(b.createdAt),
      }));
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
      return [];
    }
  },

  saveBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  },

  addBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveBookings(bookings);
  },

  updateBooking(id: string, updates: Partial<Booking>): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      this.saveBookings(bookings);
    }
  },

  deleteBooking(id: string): void {
    const bookings = this.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    this.saveBookings(filtered);
  },

  clearAll(): void {
    localStorage.removeItem(BOOKINGS_KEY);
  },
};
