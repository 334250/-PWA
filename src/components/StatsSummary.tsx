import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsSummaryProps {
  income: number;
  expense: number;
}

export function StatsSummary({ income, expense }: StatsSummaryProps) {
  const balance = income - expense;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm opacity-90 mb-1">本月结余</div>
        <div className="text-3xl">¥ {balance.toFixed(2)}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm opacity-90">收入</span>
          </div>
          <div className="text-xl">¥ {income.toFixed(2)}</div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm opacity-90">支出</span>
          </div>
          <div className="text-xl">¥ {expense.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
