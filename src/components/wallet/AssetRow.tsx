import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ArrowUpRight, Landmark } from 'lucide-react'; // Deposit, Withdraw icons
import { cn } from '@/lib/utils';

interface AssetRowProps {
  asset: {
    id: string;
    name: string; // e.g., Bitcoin
    symbol: string; // e.g., BTC
    iconUrl?: string; // URL to asset icon
    balance: number;
    valueUsd: number; // Current value in USD
    change24h?: number; // Optional: 24h percentage change
  };
  onDeposit: (assetSymbol: string) => void;
  onWithdraw: (assetSymbol: string) => void;
  onTrade: (pair: string) => void; // e.g. BTC/USDT
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, onDeposit, onWithdraw, onTrade }) => {
  console.log(`Rendering AssetRow for ${asset.symbol}`);

  const formatCurrency = (value: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits }).format(value);
  };

  const formatBalance = (value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 8 });
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 items-center py-3 px-4 border-b hover:bg-muted/50 transition-colors text-sm">
      {/* Asset Info */}
      <div className="flex items-center space-x-3 col-span-1 md:col-span-1">
        {asset.iconUrl ? (
          <img src={asset.iconUrl} alt={asset.name} className="h-8 w-8 rounded-full" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            {asset.symbol.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.symbol}</p>
        </div>
      </div>

      {/* Balance */}
      <div className="text-right md:text-left col-span-1 md:col-span-1">
        <p>{formatBalance(asset.balance)}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(asset.valueUsd)}</p>
      </div>
      
      {/* 24h Change (Optional) - hidden on small screens */}
      <div className="hidden md:block text-right md:text-left">
        {asset.change24h !== undefined ? (
          <span className={cn(asset.change24h >= 0 ? 'text-green-600' : 'text-red-600')}>
            {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>


      {/* Price (Placeholder - typically shown in market list, not wallet directly, but good for context) */}
      <div className="hidden md:block text-right md:text-left">
         {/* Example: Price could be asset.valueUsd / asset.balance if total value and balance are known */}
         {asset.balance > 0 ? formatCurrency(asset.valueUsd / asset.balance) : <span className="text-muted-foreground">-</span>}
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center space-x-1 md:space-x-2 col-span-1 md:col-span-1">
        <Button variant="ghost" size="sm" onClick={() => onDeposit(asset.symbol)} aria-label={`Deposit ${asset.symbol}`}>
          <ArrowDownRight className="h-4 w-4 mr-1 md:hidden" />
          <span className="hidden md:inline">Deposit</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onWithdraw(asset.symbol)} aria-label={`Withdraw ${asset.symbol}`}>
          <ArrowUpRight className="h-4 w-4 mr-1 md:hidden" />
           <span className="hidden md:inline">Withdraw</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTrade(`${asset.symbol}/USDT`)} aria-label={`Trade ${asset.symbol}`}>
           {/* <Landmark className="h-4 w-4 mr-1 md:hidden" /> */}
           <span className="hidden md:inline">Trade</span>
           <span className="md:hidden">Trade</span>
        </Button>
      </div>
    </div>
  );
};

export default AssetRow;