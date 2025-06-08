import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: number;
  size: number;
  total?: number; // Cumulative size
}

interface OrderBookProps {
  bids: OrderBookEntry[]; // Sorted highest price first
  asks: OrderBookEntry[]; // Sorted lowest price first
  pair: string; // e.g., "BTC/USDT"
}

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, pair }) => {
  console.log(`Rendering OrderBook for ${pair}`);

  const formatNumber = (num: number, decimals = 2) => num.toFixed(decimals);

  const renderOrders = (orders: OrderBookEntry[], type: 'bid' | 'ask') => (
    <div className="flex-1 space-y-1 text-xs">
      {orders.slice(0, 15).map((order, index) => ( // Display top 15 orders
        <div key={`${type}-${index}-${order.price}`} className="grid grid-cols-3 gap-1 items-center relative">
          <span className={cn("font-mono", type === 'bid' ? 'text-green-500' : 'text-red-500')}>
            {formatNumber(order.price, 2)}
          </span>
          <span className="text-right font-mono text-muted-foreground">{formatNumber(order.size, 4)}</span>
          <span className="text-right font-mono text-muted-foreground">{order.total ? formatNumber(order.total, 4) : '-'}</span>
           {/* Background bar for depth visualization */}
           <div
            className={cn(
              "absolute top-0 bottom-0 right-0 h-full opacity-10",
              type === 'bid' ? 'bg-green-500' : 'bg-red-500'
            )}
            style={{ width: `${(order.size / (orders[0]?.size || 1)) * 100}%` }} // Example: width based on relative size
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm">Order Book: {pair}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-[calc(100%-4rem)]"> {/* Adjust height as needed */}
        <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-muted-foreground mb-2 px-1">
          <span>Price (USDT)</span>
          <span className="text-right">Size (BTC)</span>
          <span className="text-right">Total (BTC)</span>
        </div>
        <ScrollArea className="h-full pr-2">
            <div className="mb-2">
                <h3 className="text-xs text-red-500 mb-1 font-semibold">Asks</h3>
                {renderOrders(asks, 'ask')}
            </div>
             {/* Mid-market price (optional) */}
            <div className="my-2 py-1 border-y text-center text-xs font-semibold">
                Spread: {asks.length > 0 && bids.length > 0 ? (asks[0].price - bids[0].price).toFixed(2) : '-'}
            </div>
            <div>
                <h3 className="text-xs text-green-500 mb-1 font-semibold">Bids</h3>
                {renderOrders(bids, 'bid')}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OrderBook;