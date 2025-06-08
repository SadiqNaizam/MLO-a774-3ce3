import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TradingChart from '@/components/trading/TradingChart';
import OrderBook from '@/components/trading/OrderBook';
import DepthChart from '@/components/trading/DepthChart';
import OrderForm, { OrderFormData } from '@/components/trading/OrderForm'; // Assuming OrderFormData is exported from OrderForm
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeftRight } from 'lucide-react';

// Placeholder data types
interface TradingDataPoint { time: string; price: number; volume?: number; }
interface OrderBookEntry { price: number; size: number; total?: number; }
interface DepthDataPoint { price: number; bidVolume: number; askVolume: number; }
interface OpenOrder { id: string; pair: string; type: 'Buy' | 'Sell'; price: number; amount: number; filled: number; status: 'Open' | 'Partially Filled'; }
interface TradeHistoryEntry { id: string; pair: string; type: 'Buy' | 'Sell'; price: number; amount: number; total: number; time: string; }

const availablePairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT"];

const generateMockTradingData = (pair: string): TradingDataPoint[] => {
  const data = [];
  const basePrice = pair.startsWith("BTC") ? 50000 : pair.startsWith("ETH") ? 3000 : 150;
  for (let i = 60; i >= 0; i--) {
    data.push({
      time: new Date(Date.now() - i * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: basePrice + (Math.random() - 0.5) * (basePrice * 0.01),
      volume: Math.random() * 10
    });
  }
  return data;
};

const generateMockOrderBookData = (pair: string): { bids: OrderBookEntry[], asks: OrderBookEntry[] } => {
  const basePrice = pair.startsWith("BTC") ? 50000 : pair.startsWith("ETH") ? 3000 : 150;
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let cumulativeBidSize = 0;
  let cumulativeAskSize = 0;

  for (let i = 0; i < 15; i++) {
    const bidPrice = basePrice - (i * (basePrice * 0.0001)) - (Math.random() * (basePrice * 0.00005));
    const bidSize = Math.random() * 2;
    cumulativeBidSize += bidSize;
    bids.push({ price: parseFloat(bidPrice.toFixed(2)), size: parseFloat(bidSize.toFixed(4)), total: parseFloat(cumulativeBidSize.toFixed(4)) });

    const askPrice = basePrice + (i * (basePrice * 0.0001)) + (Math.random() * (basePrice * 0.00005));
    const askSize = Math.random() * 2;
    cumulativeAskSize += askSize;
    asks.push({ price: parseFloat(askPrice.toFixed(2)), size: parseFloat(askSize.toFixed(4)), total: parseFloat(cumulativeAskSize.toFixed(4)) });
  }
  return { bids, asks: asks.sort((a, b) => a.price - b.price) }; // Asks sorted lowest price first
};

const generateMockDepthData = (orderBook: { bids: OrderBookEntry[], asks: OrderBookEntry[] }): DepthDataPoint[] => {
  const depthData: DepthDataPoint[] = [];
  const allPrices = new Set([...orderBook.bids.map(b => b.price), ...orderBook.asks.map(a => a.price)]);
  const sortedPrices = Array.from(allPrices).sort((a, b) => a - b);

  sortedPrices.forEach(price => {
    depthData.push({
      price,
      bidVolume: orderBook.bids.filter(b => b.price >= price).reduce((sum, b) => sum + b.size, 0),
      askVolume: orderBook.asks.filter(a => a.price <= price).reduce((sum, a) => sum + a.size, 0),
    });
  });
  return depthData;
};


const TradingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPair = searchParams.get('pair') || availablePairs[0];
  const [selectedPair, setSelectedPair] = useState<string>(initialPair);
  
  const [tradingData, setTradingData] = useState<TradingDataPoint[]>([]);
  const [orderBookData, setOrderBookData] = useState<{ bids: OrderBookEntry[], asks: OrderBookEntry[] }>({ bids: [], asks: [] });
  const [depthChartData, setDepthChartData] = useState<DepthDataPoint[]>([]);
  
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryEntry[]>([]);
  
  const [userBalanceBase, setUserBalanceBase] = useState(5.0); // e.g. BTC
  const [userBalanceQuote, setUserBalanceQuote] = useState(100000.0); // e.g. USDT

  useEffect(() => {
    console.log(`TradingPage loaded for pair: ${selectedPair}`);
    setTradingData(generateMockTradingData(selectedPair));
    const newOrderBook = generateMockOrderBookData(selectedPair);
    setOrderBookData(newOrderBook);
    setDepthChartData(generateMockDepthData(newOrderBook));

    // Mock open orders and trade history
    setOpenOrders([
      { id: '1', pair: selectedPair, type: 'Buy', price: selectedPair.startsWith("BTC") ? 49500 : 2950, amount: 0.1, filled: 0, status: 'Open' },
    ]);
    setTradeHistory([
      { id: 'th1', pair: selectedPair, type: 'Sell', price: selectedPair.startsWith("BTC") ? 50100 : 3010, amount: 0.05, total: (selectedPair.startsWith("BTC") ? 50100 : 3010) * 0.05, time: new Date().toLocaleTimeString() },
    ]);

    // Update URL search param without full navigation
    setSearchParams({ pair: selectedPair }, { replace: true });

  }, [selectedPair, setSearchParams]);

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
  };

  const handleSubmitOrder = async (data: OrderFormData & { type: 'buy' | 'sell', orderType: 'limit' | 'market' }) => {
    console.log('Submitting order:', data, 'for pair:', selectedPair);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newOrder: OpenOrder = {
      id: String(Date.now()),
      pair: selectedPair,
      type: data.type === 'buy' ? 'Buy' : 'Sell',
      price: data.orderType === 'limit' ? data.price! : (orderBookData.bids[0]?.price || 0), // Market price approx
      amount: data.amount,
      filled: 0,
      status: 'Open',
    };
    setOpenOrders(prev => [newOrder, ...prev]);

    // Simulate balance update
    if(data.type === 'buy') {
        setUserBalanceQuote(prev => prev - (newOrder.price * newOrder.amount));
        // setUserBalanceBase(prev => prev + newOrder.amount); // This would happen on fill
    } else {
        setUserBalanceBase(prev => prev - newOrder.amount);
        // setUserBalanceQuote(prev => prev + (newOrder.price * newOrder.amount)); // This would happen on fill
    }
    
    // toast.success(`${data.orderType.charAt(0).toUpperCase() + data.orderType.slice(1)} ${data.type} order placed for ${data.amount} ${selectedPair.split('/')[0]}`);
    // Sonner toast is called from within OrderForm.tsx
  };

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancelling order:", orderId);
    setOpenOrders(prev => prev.filter(o => o.id !== orderId));
    toast.info("Order cancelled.");
    // TODO: Revert held balances if applicable
  };

  const [baseAsset, quoteAsset] = selectedPair.split('/');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-2 py-4 sm:px-4 sm:py-6">
        <div className="mb-4 flex items-center gap-4">
           <ArrowLeftRight className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Trade</h1>
          <Select value={selectedPair} onValueChange={handlePairChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select pair" />
            </SelectTrigger>
            <SelectContent>
              {availablePairs.map(pair => (
                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Chart Area and Order Form */}
          <div className="lg:col-span-9 space-y-4">
            <TradingChart data={tradingData} pair={selectedPair} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DepthChart data={depthChartData} pair={selectedPair} />
                <OrderForm
                    pair={selectedPair}
                    baseAsset={baseAsset}
                    quoteAsset={quoteAsset}
                    userBalanceBase={userBalanceBase}
                    userBalanceQuote={userBalanceQuote}
                    onSubmitOrder={handleSubmitOrder}
                />
            </div>
          </div>

          {/* Order Book */}
          <div className="lg:col-span-3">
            <OrderBook bids={orderBookData.bids} asks={orderBookData.asks} pair={selectedPair} />
          </div>
        </div>

        {/* Tabs for Open Orders, Trade History etc. */}
        <section className="mt-6">
          <Tabs defaultValue="open-orders">
            <TabsList>
              <TabsTrigger value="open-orders">Open Orders ({openOrders.length})</TabsTrigger>
              <TabsTrigger value="trade-history">Trade History</TabsTrigger>
              {/* <TabsTrigger value="funds">Funds</TabsTrigger> */}
            </TabsList>
            <TabsContent value="open-orders">
              <Card>
                <CardHeader><CardTitle>Your Open Orders</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pair</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Filled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openOrders.length > 0 ? openOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>{order.pair}</TableCell>
                          <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.type}</TableCell>
                          <TableCell className="text-right">{order.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{order.amount.toFixed(4)}</TableCell>
                          <TableCell className="text-right">{order.filled.toFixed(4)}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleCancelOrder(order.id)}>Cancel</Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={7} className="text-center">No open orders.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trade-history">
              <Card>
                <CardHeader><CardTitle>Your Trade History</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Pair</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistory.length > 0 ? tradeHistory.map(trade => (
                        <TableRow key={trade.id}>
                          <TableCell>{trade.time}</TableCell>
                          <TableCell>{trade.pair}</TableCell>
                          <TableCell className={trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{trade.type}</TableCell>
                          <TableCell className="text-right">{trade.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{trade.amount.toFixed(4)}</TableCell>
                          <TableCell className="text-right">{trade.total.toFixed(2)} {trade.pair.split('/')[1]}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={6} className="text-center">No trade history.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TradingPage;