interface AIOrbProps {
  size?: "sm" | "md" | "lg";
}

export function AIOrb({ size = "md" }: AIOrbProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-20 h-20",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-chart-2 to-chart-3 opacity-80 blur-sm animate-pulse" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/50 via-chart-2/50 to-chart-3/50 animate-spin" style={{ animationDuration: '3s' }} />
      <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-sm" />
      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary to-chart-2 opacity-90" />
    </div>
  );
}
