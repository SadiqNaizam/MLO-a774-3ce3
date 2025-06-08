import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ListOrdered, CheckCircle, XCircle, History } from 'lucide-react';

interface Order {
  id: string;
  pair: string;
  type: 'Buy' | 'Sell';
  orderType: 'Limit' | 'Market';
  price?: number; // Undefined for market orders until filled
  amount: number;
  filledAmount: number;
  status: 'Open' | 'Partially Filled' | 'Filled' | 'Cancelled';
  createdAt: string; // ISO string or formatted date
  avgFillPrice?: number;
  totalValue?: number; // amount * price (for limit) or filledAmount * avgFillPrice
}

const mockOpenOrders: Order[] = [
  { id: 'o1', pair: 'BTC/USDT', type: 'Buy', orderType: 'Limit', price: 49500, amount: 0.1, filledAmount: 0, status: 'Open', createdAt: new Date(Date.now() - 3600000).toLocaleString() },
  { id: 'o2', pair: 'ETH/USDT', type: 'Sell', orderType: 'Limit', price: 3100, amount: 2, filledAmount: 0.5, status: 'Partially Filled', createdAt: new Date(Date.now() - 7200000).toLocaleString(), avgFillPrice: 3105 },
];

const mockOrderHistory: Order[] = [
  { id: 'h1', pair: 'SOL/USDT', type: 'Buy', orderType: 'Market', amount: 10, filledAmount: 10, status: 'Filled', createdAt: new Date(Date.now() - 86400000).toLocaleString(), avgFillPrice: 145.50, totalValue: 1455.00 },
  { id: 'h2', pair: 'BTC/USDT', type: 'Buy', orderType: 'Limit', price: 48000, amount: 0.05, filledAmount: 0.05, status: 'Filled', createdAt: new Date(Date.now() - 172800000).toLocaleString(), avgFillPrice: 48000, totalValue: 2400.00 },
  { id: 'h3', pair: 'ADA/USDT', type: 'Sell', orderType: 'Limit', price: 0.45, amount: 1000, filledAmount: 0, status: 'Cancelled', createdAt: new Date(Date.now() - 259200000).toLocaleString() },
];

const ITEMS_PER_PAGE = 10;

const OrdersPage = () => {
  const [openOrders, setOpenOrders] = useState<Order[]>(mockOpenOrders);
  const [orderHistory, setOrderHistory] = useState<Order[]>(mockOrderHistory);
  
  const [currentOpenOrdersPage, setCurrentOpenOrdersPage] = useState(1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);

  console.log('OrdersPage loaded');

  const paginatedOpenOrders = useMemo(() => {
    const startIndex = (currentOpenOrdersPage - 1) * ITEMS_PER_PAGE;
    return openOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [openOrders, currentOpenOrdersPage]);

  const paginatedOrderHistory = useMemo(() => {
    const startIndex = (currentHistoryPage - 1) * ITEMS_PER_PAGE;
    return orderHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [orderHistory, currentHistoryPage]);

  const totalOpenOrdersPages = Math.ceil(openOrders.length / ITEMS_PER_PAGE);
  const totalHistoryPages = Math.ceil(orderHistory.length / ITEMS_PER_PAGE);

  const handleCancelOrder = (orderId: string) => {
    // Simulate API call
    setOpenOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      ).filter(order => order.status !== 'Cancelled') // Or move to history
    );
    // Add to history if it makes sense for the platform
    const cancelledOrder = openOrders.find(o => o.id === orderId);
    if (cancelledOrder) {
      setOrderHistory(prev => [{ ...cancelledOrder, status: 'Cancelled'}, ...prev]);
    }
    toast.success(`Order ${orderId} cancelled.`);
  };

  const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    if (totalPages <= 1) return null;
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); if(currentPage > 1) onPageChange(currentPage - 1)}} disabled={currentPage === 1} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => {e.preventDefault(); onPageChange(i + 1)}}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* Add Ellipsis logic if many pages */}
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => {e.preventDefault(); if(currentPage < totalPages) onPageChange(currentPage + 1)}} disabled={currentPage === totalPages} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <ListOrdered className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Order Management</h1>
        </div>

        <Tabs defaultValue="open-orders">
          <TabsList className="mb-4">
            <TabsTrigger value="open-orders">Open Orders ({openOrders.length})</TabsTrigger>
            <TabsTrigger value="order-history">Order History ({orderHistory.length})</TabsTrigger>
            {/* Potentially add "Trade History" here too if different from order history */}
          </TabsList>

          <TabsContent value="open-orders">
            <Card>
              <CardHeader>
                <CardTitle>Current Open Orders</CardTitle>
                <CardDescription>Monitor and manage your active trading orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Filled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOpenOrders.length > 0 ? paginatedOpenOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="text-xs">{order.createdAt}</TableCell>
                        <TableCell>{order.pair}</TableCell>
                        <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.type}</TableCell>
                        <TableCell>{order.orderType}</TableCell>
                        <TableCell className="text-right">{order.price ? `$${order.price.toFixed(2)}` : 'Market'}</TableCell>
                        <TableCell className="text-right">{order.amount.toFixed(4)}</TableCell>
                        <TableCell className="text-right">{order.filledAmount.toFixed(4)} ({((order.filledAmount / order.amount) * 100).toFixed(0)}%)</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            order.status === 'Partially Filled' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : ''
                           }`}>{order.status}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleCancelOrder(order.id)}>
                            <XCircle className="mr-1 h-4 w-4"/> Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={9} className="text-center">No open orders.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
                {renderPagination(currentOpenOrdersPage, totalOpenOrdersPages, setCurrentOpenOrdersPage)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order-history">
            <Card>
              <CardHeader>
                <CardTitle>Completed & Cancelled Orders</CardTitle>
                <CardDescription>Review your past trading orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                       <TableHead>Order Type</TableHead>
                      <TableHead className="text-right">Avg. Fill Price</TableHead>
                      <TableHead className="text-right">Filled Amount</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrderHistory.length > 0 ? paginatedOrderHistory.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="text-xs">{order.createdAt}</TableCell>
                        <TableCell>{order.pair}</TableCell>
                        <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.type}</TableCell>
                        <TableCell>{order.orderType}</TableCell>
                        <TableCell className="text-right">{order.avgFillPrice ? `$${order.avgFillPrice.toFixed(2)}` : (order.price ? `$${order.price.toFixed(2)}` : 'N/A')}</TableCell>
                        <TableCell className="text-right">{order.filledAmount.toFixed(4)}</TableCell>
                        <TableCell className="text-right">{order.totalValue ? `$${order.totalValue.toFixed(2)}` : 'N/A'}</TableCell>
                         <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            order.status === 'Filled' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                           }`}>
                            {order.status === 'Filled' && <CheckCircle className="mr-1 h-3 w-3"/>}
                            {order.status === 'Cancelled' && <XCircle className="mr-1 h-3 w-3"/>}
                            {order.status}
                           </span>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={8} className="text-center">No order history.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
                {renderPagination(currentHistoryPage, totalHistoryPages, setCurrentHistoryPage)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;