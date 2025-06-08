import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AssetRow from '@/components/wallet/AssetRow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wallet, History, Copy, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  iconUrl?: string;
  balance: number;
  valueUsd: number;
  change24h?: number;
  depositAddress?: string; // For mock deposit
}

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal';
  assetSymbol: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  address?: string;
}

const initialAssets: Asset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', balance: 1.25, valueUsd: 62500, change24h: 2.5, depositAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', balance: 20.7, valueUsd: 62100, change24h: -1.2, depositAddress: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', balance: 10000, valueUsd: 10000, change24h: 0.1, depositAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', balance: 150, valueUsd: 22500, change24h: 5.8, depositAddress: 'SoLANNnnsensensensensensensensensenSENsENsEnseNSENsE' },
];

const initialTransactions: Transaction[] = [
  { id: 't1', type: 'Deposit', assetSymbol: 'BTC', amount: 0.5, date: '2024-07-15 10:30', status: 'Completed', address: '1A1z...DivfNa' },
  { id: 't2', type: 'Withdrawal', assetSymbol: 'ETH', amount: 2, date: '2024-07-14 15:00', status: 'Completed', address: '0x3Cf...9a5b' },
  { id: 't3', type: 'Deposit', assetSymbol: 'USDT', amount: 1000, date: '2024-07-16 09:00', status: 'Pending', address: '0xdAC...1ec7' },
];

const WalletPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  console.log('WalletPage loaded');

  const handleDeposit = (assetSymbol: string) => {
    const asset = assets.find(a => a.symbol === assetSymbol);
    if (asset) {
      setSelectedAsset(asset);
      setIsDepositDialogOpen(true);
    }
  };

  const handleWithdraw = (assetSymbol: string) => {
    const asset = assets.find(a => a.symbol === assetSymbol);
    if (asset) {
      setSelectedAsset(asset);
      setWithdrawAmount('');
      setWithdrawAddress('');
      setIsWithdrawDialogOpen(true);
    }
  };
  
  const handleTrade = (pair: string) => {
    navigate(`/trading?pair=${pair}`);
  }

  const processWithdrawal = () => {
    if (!selectedAsset || !withdrawAmount || !withdrawAddress) {
      toast.error("Please fill in all withdrawal details.");
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > selectedAsset.balance) {
      toast.error("Invalid withdrawal amount or insufficient balance.");
      return;
    }
    console.log(`Withdraw ${amount} ${selectedAsset.symbol} to ${withdrawAddress}`);
    // Simulate API call & update state
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      type: 'Withdrawal',
      assetSymbol: selectedAsset.symbol,
      amount: amount,
      date: new Date().toLocaleString(),
      status: 'Pending',
      address: withdrawAddress
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAssets(prevAssets => prevAssets.map(a => 
      a.id === selectedAsset.id ? { ...a, balance: a.balance - amount, valueUsd: (a.balance - amount) * (a.valueUsd / a.balance) } : a
    ));
    toast.success(`Withdrawal of ${amount} ${selectedAsset.symbol} initiated.`);
    setIsWithdrawDialogOpen(false);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied to clipboard!");
    }).catch(err => {
      toast.error("Failed to copy address.");
      console.error('Failed to copy: ', err);
    });
  };

  const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.valueUsd, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Wallet</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Total Value: ${totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-sm text-muted-foreground">Manage your crypto assets and transactions.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="assets">
          <TabsList className="mb-4">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Your Crypto Holdings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="hidden md:grid grid-cols-5 items-center py-2 px-4 border-b bg-muted/50 text-sm font-semibold">
                    <div className="col-span-1">Asset</div>
                    <div className="col-span-1 text-left">Balance</div>
                    <div className="col-span-1 text-left">24h Change</div>
                    <div className="col-span-1 text-left">Price (USD)</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
                {assets.length > 0 ? assets.map(asset => (
                  <AssetRow 
                    key={asset.id} 
                    asset={asset} 
                    onDeposit={handleDeposit} 
                    onWithdraw={handleWithdraw}
                    onTrade={handleTrade}
                  />
                )) : (
                  <div className="text-center py-8 text-muted-foreground">No assets found.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Log</CardTitle>
                 <CardDescription>Your recent deposits and withdrawals.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Address/Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? transactions.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-xs">{tx.date}</TableCell>
                        <TableCell className={tx.type === 'Deposit' ? 'text-green-500' : 'text-red-500'}>{tx.type}</TableCell>
                        <TableCell>{tx.assetSymbol}</TableCell>
                        <TableCell className="text-right">{tx.amount.toFixed(8)}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 text-xs rounded-full ${
                            tx.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                           }`}>{tx.status}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground truncate max-w-[150px]">{tx.address || '-'}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={6} className="text-center">No transactions yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit {selectedAsset?.symbol}</DialogTitle>
            <DialogDescription>
              Send only {selectedAsset?.symbol} to this address. Sending any other coin may result in permanent loss.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Label htmlFor="deposit-address">Your {selectedAsset?.symbol} Deposit Address:</Label>
            <div className="flex items-center space-x-2">
              <Input id="deposit-address" readOnly value={selectedAsset?.depositAddress || 'N/A'} className="truncate"/>
              <Button variant="outline" size="icon" onClick={() => selectedAsset?.depositAddress && copyToClipboard(selectedAsset.depositAddress)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center p-4 border rounded-md bg-muted">
                {/* Placeholder for QR Code */}
                <QrCode className="h-32 w-32 text-muted-foreground" />
                {/* <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAsset?.depositAddress}`} alt="QR Code" /> */}
            </div>
            <p className="text-xs text-muted-foreground">Minimum deposit: 0.0001 {selectedAsset?.symbol}. Confirmations needed: 3.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw {selectedAsset?.symbol}</DialogTitle>
            <DialogDescription>Ensure the address is correct and on the {selectedAsset?.name} network.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="withdraw-address">{selectedAsset?.symbol} Address</Label>
              <Input id="withdraw-address" value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} placeholder={`Enter ${selectedAsset?.symbol} address`} />
            </div>
            <div>
              <Label htmlFor="withdraw-amount">Amount (Available: {selectedAsset?.balance.toFixed(8)})</Label>
              <Input id="withdraw-amount" type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0.00" />
            </div>
            <p className="text-xs text-muted-foreground">Network fee: 0.00005 {selectedAsset?.symbol}. You will receive: {(parseFloat(withdrawAmount) || 0) - 0.00005 > 0 ? ((parseFloat(withdrawAmount) || 0) - 0.00005).toFixed(8) : '0.00'} {selectedAsset?.symbol}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={processWithdrawal}>Confirm Withdrawal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;