import React, { useState } from 'react';
import { Gavel, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { submitBid } from "@/lib/api";

interface BidStatus {
  type: 'success' | 'error';
  message: string;
}

export default function Bidding() {
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<BidStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount)) {
      setStatus({ type: 'error', message: 'Please enter a valid amount.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    
    const result = await submitBid(bidAmount);
    
    if (result.success) {
        setStatus({ type: 'success', message: 'Blind bid submitted. Current status: WINNING.' });
        setAmount('');
    } else {
        setStatus({ type: 'error', message: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Bidding System</h1>
        <p className="text-muted-foreground">Participate in the blind bidding mechanism for "Alumni of the Day" features.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-3 rounded-xl">
                    <Gavel className="text-amber-600" size={24} />
                </div>
                <div>
                    <CardTitle>Place a Blind Bid</CardTitle>
                    <CardDescription>Bids are private and evaluated at midnight daily.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleBid} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Your Bid Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">£</span>
                  <Input 
                    type="number" 
                    className="pl-8 py-6 text-xl font-bold" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <Alert className="bg-slate-50 border-slate-200">
                   <ShieldCheck size={18} className="text-primary" />
                   <AlertDescription className="text-muted-foreground">
                      Your available university sponsorship backing: <strong className="text-foreground">£2,500.00</strong>
                   </AlertDescription>
                </Alert>
              </div>

              <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                {loading ? 'Submitting...' : <><Gavel className="mr-2" size={20} /> Submit Blind Bid</>}
              </Button>
            </form>

            {status && (
              <Alert variant={status.type === 'success' ? 'default' : 'destructive'} className={status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : ''}>
                {status.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{status.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Governance Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-4">
                <li className="flex gap-2">
                    <Badge variant="outline" className="h-fit py-0">RULE</Badge>
                    <span><strong>Blind Auction</strong>: Current highest bids are hidden to ensure fair competition.</span>
                </li>
                <li className="flex gap-2">
                    <Badge variant="outline" className="h-fit py-0">LIMIT</Badge>
                    <span><strong>Feature Limit</strong>: Maximum of 3 "Alumni of the Day" wins per month.</span>
                </li>
                <li className="flex gap-2">
                    <Badge variant="outline" className="h-fit py-0">POLICY</Badge>
                    <span><strong>Irreversible</strong>: Bids can only be increased, never lowered.</span>
                </li>
                <li className="flex gap-2">
                    <Badge variant="outline" className="h-fit py-0">CLOCK</Badge>
                    <span><strong>Daily Reset</strong>: Winners selected at 00:00 UTC.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">My Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Current Bid</span>
                    <span className="font-bold text-lg">£150.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Market Position</span>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">LEADING</Badge>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
