import { BalanceSummarySection } from '../../components/sections/balance-summary.section';
import { DebtDetailSection } from '../../components/sections/debt-detail.section';
import { ExpenseHistorySection } from '../../components/sections/expense-history.section';

export function HomeClient() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <BalanceSummarySection />
      <DebtDetailSection />
      <ExpenseHistorySection />
    </div>
  );
}
