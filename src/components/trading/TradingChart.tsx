import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example data structure for the chart
interface TradingDataPoint {
  time: string; // or number (timestamp)
  price: number;
  volume?: number;
}

interface TradingChartProps {
  data: TradingDataPoint[];
  pair: string; // e.g., "BTC/USDT"
}

const TradingChart: React.FC<TradingChartProps> = ({ data, pair }) => {
  console.log(`Rendering TradingChart for ${pair} with ${data.length} data points`);

  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">No trading data available for {pair}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pair} Price Chart</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} allowDataOverflow={true} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            {/* Optionally add a volume series if data includes it */}
            {/* <Line type="monotone" dataKey="volume" stroke="#82ca9d" yAxisId="volume" /> */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TradingChart;