import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DepthDataPoint {
  price: number;
  bidVolume: number;
  askVolume: number;
}

interface DepthChartProps {
  data: DepthDataPoint[]; // Sorted by price
  pair: string;
}

const DepthChart: React.FC<DepthChartProps> = ({ data, pair }) => {
  console.log(`Rendering DepthChart for ${pair} with ${data.length} data points`);

  if (!data || data.length === 0) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">No depth data available for {pair}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Depth: {pair}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="price" type="number" domain={['dataMin', 'dataMax']} tick={{ fontSize: 10 }} />
            <YAxis orientation="left" yAxisId="left" tick={{ fontSize: 10 }} />
            <YAxis orientation="right" yAxisId="right" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area yAxisId="left" type="stepAfter" dataKey="bidVolume" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Bids" />
            <Area yAxisId="right" type="stepAfter" dataKey="askVolume" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Asks" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DepthChart;