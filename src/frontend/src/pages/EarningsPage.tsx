import { useEarnings } from '../hooks/useEarnings';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function EarningsPage() {
  const { totalEarned, currentBalance, transactions, withdraw } = useEarnings();

  const handleWithdraw = async () => {
    if (currentBalance === 0) {
      toast.error('No balance available to withdraw');
      return;
    }

    try {
      await withdraw();
      toast.success('Withdrawal successful!');
    } catch (error) {
      toast.error('Withdrawal failed');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Earnings</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              +28% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentBalance.toFixed(2)}</div>
            <Button
              onClick={handleWithdraw}
              size="sm"
              className="mt-2"
              disabled={currentBalance === 0}
            >
              Withdraw
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="font-semibold">₹{transaction.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
