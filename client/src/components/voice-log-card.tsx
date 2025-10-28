import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { VoiceLog } from "../../../shared/voice-logs-schema";
import { Phone, Clock, User, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { format, formatDistance } from "date-fns";

interface VoiceLogCardProps {
  log: VoiceLog;
  index: number;
}

export function VoiceLogCard({ log, index }: VoiceLogCardProps) {
  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return {
          icon: TrendingUp,
          color: "text-success-glow",
          bgColor: "bg-success-glow/10",
          label: "Positive",
        };
      case "negative":
        return {
          icon: TrendingDown,
          color: "text-error-glow",
          bgColor: "bg-error-glow/10",
          label: "Negative",
        };
      default:
        return {
          icon: Minus,
          color: "text-muted-foreground",
          bgColor: "bg-muted/30",
          label: "Neutral",
        };
    }
  };

  const getOutcomeConfig = (outcome: string) => {
    switch (outcome) {
      case "booking_created":
        return {
          icon: CheckCircle2,
          color: "text-success-glow",
          label: "Booking Created",
        };
      case "rescheduled":
        return {
          icon: AlertCircle,
          color: "text-warning-glow",
          label: "Rescheduled",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-error-glow",
          label: "Cancelled",
        };
      default:
        return {
          icon: HelpCircle,
          color: "text-neon-glow",
          label: "Inquiry",
        };
    }
  };

  const sentimentConfig = getSentimentConfig(log.sentiment);
  const outcomeConfig = getOutcomeConfig(log.outcome);
  const SentimentIcon = sentimentConfig.icon;
  const OutcomeIcon = outcomeConfig.icon;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      className="glass hover-elevate transition-all duration-300 p-6 slide-in-top"
      style={{ animationDelay: `${index * 50}ms` }}
      data-testid={`card-voice-log-${log.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-glow/20 flex items-center justify-center border border-neon-glow/30">
            <Phone className="w-5 h-5 text-neon-glow" />
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid={`text-caller-${log.id}`}>
              {log.clientName}
            </h3>
            <p className="text-xs text-muted-foreground" data-testid={`text-time-${log.id}`}>
              {formatDistance(log.createdAt, new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${sentimentConfig.bgColor}`}>
            <SentimentIcon className={`w-3.5 h-3.5 ${sentimentConfig.color}`} />
            <span className={`text-xs font-medium ${sentimentConfig.color}`}>
              {sentimentConfig.label}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 border border-glass-border">
          <p className="text-sm leading-relaxed text-foreground/90 italic" data-testid={`text-transcript-${log.id}`}>
            "{log.transcript}"
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid={`text-duration-${log.id}`}>{formatDuration(log.duration)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <OutcomeIcon className={`w-4 h-4 ${outcomeConfig.color}`} />
              <span className={`font-medium ${outcomeConfig.color}`} data-testid={`text-outcome-${log.id}`}>
                {outcomeConfig.label}
              </span>
            </div>
          </div>

          <span className="text-xs text-muted-foreground font-mono" data-testid={`text-call-id-${log.id}`}>
            {log.callId}
          </span>
        </div>
      </div>
    </Card>
  );
}
