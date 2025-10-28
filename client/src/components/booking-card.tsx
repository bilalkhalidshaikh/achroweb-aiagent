import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Booking } from "../../../shared/schema";
import { BOOKING_STATUSES } from "../../../shared/schema";
import { Calendar, Clock, User, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  booking: Booking;
  index: number;
}

export function BookingCard({ booking, index }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        return "glow-success";
      case BOOKING_STATUSES.RESCHEDULED:
        return "glow-warning";
      case BOOKING_STATUSES.CANCELED:
        return "glow-error";
      default:
        return "glow-primary";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        return "default";
      case BOOKING_STATUSES.RESCHEDULED:
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card
      className={`glass hover-elevate transition-all duration-300 p-6 ${getStatusColor(booking.status)} slide-in-top`}
      style={{ animationDelay: `${index * 50}ms` }}
      data-testid={`card-booking-${booking.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid={`text-client-${booking.id}`}>
              {booking.clientName}
            </h3>
            <p className="text-xs text-muted-foreground font-mono" data-testid={`text-booking-id-${booking.id}`}>
              #{booking.id.slice(0, 8)}
            </p>
          </div>
        </div>
        
        <Badge 
          variant={getStatusVariant(booking.status)} 
          className="text-xs"
          data-testid={`badge-status-${booking.id}`}
        >
          {booking.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span className="uppercase tracking-wide text-xs font-medium" data-testid={`text-service-${booking.id}`}>
            {booking.serviceType}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-date-${booking.id}`}>
            {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span data-testid={`text-time-${booking.id}`}>
            {format(new Date(booking.bookingDate), "h:mm a")}
          </span>
        </div>

        {booking.notes && (
          <div className="mt-4 pt-4 border-t border-glass-border">
            <p className="text-sm text-muted-foreground italic" data-testid={`text-notes-${booking.id}`}>
              {booking.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
