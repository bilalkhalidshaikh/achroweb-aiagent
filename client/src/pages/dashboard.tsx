import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Booking, InsertBooking } from "@shared/schema";
import { BOOKING_STATUSES, SERVICE_TYPES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Phone, 
  Send,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Mic2
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { VapiModal } from "@/components/vapi-modal";
import { StatsCard } from "@/components/stats-card";
import { BookingCard } from "@/components/booking-card";
import { AIOrb } from "@/components/ai-orb";
import { parseBookingInput } from "@/lib/booking-parser";
import { localStorageService } from "@/lib/local-storage";
import { mockVoiceLogs } from "@shared/voice-logs-schema";
import { VoiceLogCard } from "@/components/voice-log-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { BarChart3 } from "lucide-react";

export default function Dashboard() {
  const [bookingInput, setBookingInput] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVapiModalOpen, setIsVapiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Sync bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorageService.saveBookings(bookings);
    }
  }, [bookings]);

  const createBookingMutation = useMutation({
    mutationFn: async (booking: InsertBooking) => {
      return apiRequest("POST", "/api/bookings", booking);
    },
    onSuccess: (newBooking: Booking) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      localStorageService.addBooking(newBooking);
      setBookingInput("");
      toast({
        title: "Booking Created",
        description: "Your booking has been successfully logged.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingInput.trim()) return;

    const parsedBooking = parseBookingInput(bookingInput);
    if (parsedBooking) {
      createBookingMutation.mutate(parsedBooking);
    } else {
      toast({
        title: "Invalid Input",
        description: "Could not parse booking. Try: 'Book for John at 4 PM tomorrow for AI Consultation'",
        variant: "destructive",
      });
    }
  };

  const confirmedToday = bookings.filter(
    (b) => b.status === BOOKING_STATUSES.CONFIRMED && 
    format(new Date(b.bookingDate), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;

  const pendingCount = bookings.filter(
    (b) => b.status === BOOKING_STATUSES.PENDING
  ).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-neon-glow rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-success-glow rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-neon-glow rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-strong border-b border-glass-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AIOrb />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
                    <span className="gradient-text">Achroweb Solutions</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                    Agentic Booking Intelligence
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Badge 
                  variant="outline" 
                  className="gap-2 px-3 py-1.5 border-glass-border bg-card/50 backdrop-blur-sm pulse-glow"
                  data-testid="badge-live-time"
                >
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">
                    {format(currentTime, "HH:mm:ss")}
                  </span>
                </Badge>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground/80 mt-3 italic">
              "Turning Conversations into Confirmations."
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Command Section */}
          <div className="mb-8 sm:mb-12">
            <Card className="glass-strong p-6 sm:p-8 glow-primary" data-testid="card-command-center">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display mb-2">
                    AI Command Center
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Launch voice assistant or simulate bookings instantly
                  </p>
                </div>
                
                <Button
                  size="lg"
                  onClick={() => setIsVapiModalOpen(true)}
                  className="gap-2 glow-primary w-full lg:w-auto group"
                  data-testid="button-launch-vapi"
                >
                  <Mic2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Launch Voice Agent</span>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    value={bookingInput}
                    onChange={(e) => setBookingInput(e.target.value)}
                    placeholder="Book for John at 4 PM tomorrow for AI Consultation..."
                    className="pr-12 bg-background/50 border-glass-border text-base h-12 pl-4"
                    data-testid="input-booking"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={createBookingMutation.isPending || !bookingInput.trim()}
                    className="absolute right-1 top-1 h-10 w-10"
                    data-testid="button-submit-booking"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Try: "Book for Sarah at 3 PM on Friday for Automation Setup" or "Schedule Mike tomorrow at 2 PM for Voice AI Demo"
                </p>
              </form>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-12">
            <StatsCard
              title="Total Bookings"
              value={bookings.length}
              icon={Calendar}
              trend="up"
              color="primary"
              testId="stats-total"
            />
            <StatsCard
              title="Confirmed Today"
              value={confirmedToday}
              icon={CheckCircle2}
              trend="up"
              color="success"
              testId="stats-confirmed"
            />
            <StatsCard
              title="Pending Actions"
              value={pendingCount}
              icon={AlertCircle}
              trend="neutral"
              color="warning"
              testId="stats-pending"
            />
          </div>

          {/* Tabbed Content Section */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="glass-strong" data-testid="tabs-list">
                  <TabsTrigger value="bookings" className="gap-2" data-testid="tab-bookings">
                    <Calendar className="w-4 h-4" />
                    Live Bookings
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {bookings.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="voice-logs" className="gap-2" data-testid="tab-voice-logs">
                    <Phone className="w-4 h-4" />
                    Voice Logs
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {mockVoiceLogs.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2" data-testid="tab-analytics">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="bookings" className="mt-0 space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="glass p-6 animate-pulse" data-testid={`skeleton-${i}`}>
                        <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                        <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </Card>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <Card className="glass-strong p-12 text-center" data-testid="card-empty-state">
                    <div className="flex justify-center mb-4">
                      <AIOrb size="lg" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Start by simulating a booking above or launch the Voice Agent to see the system in action.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBookingInput("Book for Alex at 2 PM tomorrow for AI Consultation");
                        }}
                        className="gap-2"
                        data-testid="button-try-example"
                      >
                        <Sparkles className="w-4 h-4" />
                        Try Example Booking
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((booking, index) => (
                        <BookingCard key={booking.id} booking={booking} index={index} />
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="voice-logs" className="mt-0 space-y-4">
                {mockVoiceLogs.length === 0 ? (
                  <Card className="glass-strong p-12 text-center">
                    <div className="flex justify-center mb-4">
                      <Phone className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Voice Logs</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Voice call transcripts and sentiment analysis will appear here.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockVoiceLogs
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((log, index) => (
                        <VoiceLogCard key={log.id} log={log} index={index} />
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                {bookings.length === 0 ? (
                  <Card className="glass-strong p-12 text-center">
                    <div className="flex justify-center mb-4">
                      <BarChart3 className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Analytics and insights will appear here once you have booking data.
                    </p>
                  </Card>
                ) : (
                  <AnalyticsCharts bookings={bookings} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <VapiModal open={isVapiModalOpen} onOpenChange={setIsVapiModalOpen} />
    </div>
  );
}
