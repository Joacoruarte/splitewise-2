import { ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BalanceSummarySection() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€29.45</div>
          <p className="text-xs text-muted-foreground">Te deben más de lo que debes</p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Te Deben</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€81.55</div>
          <p className="text-xs text-muted-foreground">3 personas te deben dinero</p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debes</CardTitle>
          <ArrowDownLeft className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€52.10</div>
          <p className="text-xs text-muted-foreground">Debes a 2 personas</p>
        </CardContent>
      </Card>
    </div>
  );
}
