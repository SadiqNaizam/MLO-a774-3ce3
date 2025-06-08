import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // Using sonner for toasts as per guidelines
import { cn } from '@/lib/utils';

const orderSchema = z.object({
  price: z.coerce.number().positive("Price must be positive").optional(), // Optional for market orders
  amount: z.coerce.number().positive("Amount must be positive"),
  // total: z.coerce.number().positive("Total must be positive").optional(), // Could be auto-calculated
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  pair: string; // e.g., "BTC/USDT"
  baseAsset: string; // e.g., "BTC"
  quoteAsset: string; // e.g., "USDT"
  userBalanceBase: number;
  userBalanceQuote: number;
  onSubmitOrder: (data: OrderFormData & { type: 'buy' | 'sell', orderType: 'limit' | 'market' }) => Promise<void>;
}

const OrderForm: React.FC<OrderFormProps> = ({
  pair,
  baseAsset,
  quoteAsset,
  userBalanceBase,
  userBalanceQuote,
  onSubmitOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');

  console.log(`Rendering OrderForm for ${pair}, mode: ${activeTab}, type: ${orderType}`);

  const { control, handleSubmit, register, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema.refine(data => orderType === 'limit' ? !!data.price : true, {
      message: "Price is required for limit orders",
      path: ["price"],
    })),
    defaultValues: {
      price: undefined,
      amount: undefined,
    },
  });

  const priceValue = watch('price');
  const amountValue = watch('amount');

  const calculatedTotal = React.useMemo(() => {
    if (orderType === 'limit' && priceValue && amountValue) {
      return priceValue * amountValue;
    }
    // For market orders, total calculation might be more complex or estimated
    return undefined;
  }, [priceValue, amountValue, orderType]);

  const handleFormSubmit = async (data: OrderFormData) => {
    console.log("Order form submitted:", { ...data, type: activeTab, orderType });
    try {
      await onSubmitOrder({ ...data, type: activeTab, orderType });
      toast.success(` ${orderType.charAt(0).toUpperCase() + orderType.slice(1)} ${activeTab} order placed successfully for ${data.amount} ${baseAsset}.`);
      reset();
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(`Failed to place order. ${(error as Error).message || 'Please try again.'}`);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'buy' | 'sell')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-600">Buy {baseAsset}</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-600">Sell {baseAsset}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Tabs value={orderType} onValueChange={(val) => setOrderType(val as 'limit' | 'market')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs h-8">
              <TabsTrigger value="limit" className="h-full">Limit</TabsTrigger>
              <TabsTrigger value="market" className="h-full">Market</TabsTrigger>
            </TabsList>
          </Tabs>

          {orderType === 'limit' && (
            <div>
              <Label htmlFor="price">Price ({quoteAsset})</Label>
              <Input id="price" type="number" step="any" {...register('price')} placeholder="0.00" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount ({baseAsset})</Label>
            <Input id="amount" type="number" step="any" {...register('amount')} placeholder="0.00" />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>
          
          {/* Quick amount selection buttons */}
          <div className="flex space-x-1">
            {[25, 50, 75, 100].map(pct => (
              <Button
                key={pct}
                type="button"
                variant="outline"
                size="xs"
                className="flex-1 text-xs"
                onClick={() => {
                  const balance = activeTab === 'buy' ? userBalanceQuote : userBalanceBase;
                  const currentPrice = orderType === 'market' ? /* fetch current market price */ (priceValue || 1) : (priceValue || 0);
                  if (activeTab === 'buy' && currentPrice > 0) {
                     setValue('amount', parseFloat(((balance / currentPrice) * (pct / 100)).toFixed(8)) );
                  } else if (activeTab === 'sell') {
                     setValue('amount', parseFloat((balance * (pct / 100)).toFixed(8)) );
                  }
                }}
              >
                {pct}%
              </Button>
            ))}
          </div>


          {calculatedTotal !== undefined && orderType === 'limit' && (
            <div className="text-sm text-muted-foreground">
              <Label>Total (Approx.)</Label>
              <p>{calculatedTotal.toFixed(2)} {quoteAsset}</p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Available: {activeTab === 'buy' ? `${userBalanceQuote.toFixed(2)} ${quoteAsset}` : `${userBalanceBase.toFixed(8)} ${baseAsset}`}
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full",
              activeTab === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${baseAsset}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;