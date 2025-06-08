import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'; // Assuming Chart is shadcn
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const portfolioSummary = {
  totalValue: 10234.56,
  change24h: 250.75,
  changePercent: 2.5,
};

const marketTrendsData = [
  { date: 'Jan', BTC: 40000, ETH: 2500 },
  { date: 'Feb', BTC: 42000, ETH: 2800 },
  { date: 'Mar', BTC: 45000, ETH: 3000 },
  { date: 'Apr', BTC: 43000, ETH: 3100 },
  { date: 'May', BTC: 47000, ETH: 3500 },
  { date: 'Jun', BTC: 50000, ETH: 3200 },
];

const topMovers = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 50000, change: 5.2, iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3200, change: 3.1, iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 150, change: -1.5, iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.15, change: 10.8, iconUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=029' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  console.log('DashboardPage loaded');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <section>
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
                <p className={`text-xs ${portfolioSummary.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioSummary.change24h >= 0 ? '+' : ''}${portfolioSummary.change24h.toFixed(2)} ({portfolioSummary.changePercent}%) 24h
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Trends</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Positive Outlook</div>
                <p className="text-xs text-muted-foreground">Overall market is up by 3.5% today</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/trading')} className="w-full justify-start">
                  Go to Trading <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <Button onClick={() => navigate('/wallet')} variant="outline" className="w-full justify-start">
                  Manage Wallet <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Market Performance (BTC vs ETH)</CardTitle>
              <CardDescription>Monthly price trends for leading cryptocurrencies.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] p-2">
              <ChartContainer config={{}} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrendsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }}/>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line yAxisId="left" type="monotone" dataKey="BTC" stroke="#8884d8" strokeWidth={2} dot={false} name="Bitcoin (USD)" />
                    <Line yAxisId="right" type="monotone" dataKey="ETH" stroke="#82ca9d" strokeWidth={2} dot={false} name="Ethereum (USD)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Top Movers</CardTitle>
              <CardDescription>Cryptocurrencies with significant price changes in the last 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topMovers.map((coin) => (
                    <TableRow key={coin.id}>
                      <TableCell className="font-medium flex items-center">
                        <img src={coin.iconUrl || `https://via.placeholder.com/32?text=${coin.symbol.charAt(0)}`} alt={coin.name} className="h-6 w-6 mr-2 rounded-full"/>
                        {coin.name}
                      </TableCell>
                      <TableCell>{coin.symbol}</TableCell>
                      <TableCell className="text-right">${coin.price.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-semibold ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/trading?pair=${coin.symbol}/USDT`)}>
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;