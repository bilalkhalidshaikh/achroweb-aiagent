import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  color: "primary" | "success" | "warning" | "error";
  testId?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color, testId }: StatsCardProps) {
  const getColorClass = () => {
    switch (color) {
      case "success":
        return "text-success-glow";
      case "warning":
        return "text-warning-glow";
      case "error":
        return "text-error-glow";
      default:
        return "text-neon-glow";
    }
  };

  const getGlowClass = () => {
    switch (color) {
      case "success":
        return "glow-success";
      case "warning":
        return "glow-warning";
      case "error":
        return "glow-error";
      default:
        return "glow-primary";
    }
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card 
      className={`glass hover-elevate transition-all duration-300 p-6 ${getGlowClass()}`}
      data-testid={testId}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-card/50 flex items-center justify-center border border-glass-border ${getGlowClass()}`}>
          <Icon className={`w-6 h-6 ${getColorClass()}`} />
        </div>
        <TrendIcon className={`w-5 h-5 ${getColorClass()}`} />
      </div>
      
      <div>
        <div className="text-3xl font-bold font-display mb-1" data-testid={`${testId}-value`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground" data-testid={`${testId}-label`}>
          {title}
        </div>
      </div>
    </Card>
  );
}
