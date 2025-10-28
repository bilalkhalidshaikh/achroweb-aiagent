import { Card } from "@/components/ui/card";
import type { Booking } from "@shared/schema";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays, startOfDay, isAfter, isBefore } from "date-fns";

interface AnalyticsChartsProps {
  bookings: Booking[];
}

export function AnalyticsCharts({ bookings }: AnalyticsChartsProps) {
  // Booking trends over the last 7 days
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = startOfDay(subDays(date, -1));
    
    const count = bookings.filter((b) => {
      const bookingDate = new Date(b.bookingDate);
      return isAfter(bookingDate, dayStart) && isBefore(bookingDate, dayEnd);
    }).length;

    return {
      date: format(date, "MMM dd"),
      bookings: count,
    };
  });

  // Service distribution
  const serviceData = bookings.reduce((acc, booking) => {
    const service = booking.serviceType;
    const existing = acc.find((item) => item.name === service);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: service, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Status distribution
  const statusData = bookings.reduce((acc, booking) => {
    const status = booking.status;
    const existing = acc.find((item) => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const CHART_COLORS = {
    primary: "hsl(217, 91%, 28%)",
    success: "hsl(195, 85%, 62%)",
    warning: "hsl(32, 95%, 60%)",
    error: "hsl(0, 84%, 50%)",
    accent: "hsl(220, 13%, 91%)",
  };

  const PIE_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.error,
    CHART_COLORS.accent,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Trends Chart */}
      <Card className="glass p-6" data-testid="card-trends-chart">
        <h3 className="text-lg font-semibold mb-4 font-display">Booking Trends (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(220, 13%, 50%)" 
              style={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(220, 13%, 50%)" 
              style={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 6%, 11%)",
                border: "1px solid hsl(220, 13%, 20%)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
              labelStyle={{ color: "hsl(220, 13%, 91%)" }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Service Distribution Chart */}
      <Card className="glass p-6" data-testid="card-service-chart">
        <h3 className="text-lg font-semibold mb-4 font-display">Service Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={serviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill={CHART_COLORS.primary}
              dataKey="value"
            >
              {serviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 6%, 11%)",
                border: "1px solid hsl(220, 13%, 20%)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Status Distribution Chart */}
      <Card className="glass p-6 lg:col-span-2" data-testid="card-status-chart">
        <h3 className="text-lg font-semibold mb-4 font-display">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(220, 13%, 50%)" 
              style={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(220, 13%, 50%)" 
              style={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 6%, 11%)",
                border: "1px solid hsl(220, 13%, 20%)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
              labelStyle={{ color: "hsl(220, 13%, 91%)" }}
            />
            <Legend 
              wrapperStyle={{ color: "hsl(220, 13%, 91%)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.success}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.success, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
