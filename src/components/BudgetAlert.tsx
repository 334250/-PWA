import { Budget } from '../App';
import { AlertTriangle, TrendingDown, CheckCircle2 } from 'lucide-react';

interface BudgetAlertProps {
  budgets: Budget[];
  monthlyExpenses: Record<string, number>;
}

export function BudgetAlert({ budgets, monthlyExpenses }: BudgetAlertProps) {
  const alerts = budgets
    .filter((budget) => budget.period === 'monthly')
    .map((budget) => {
      const spent = monthlyExpenses[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      return {
        ...budget,
        spent,
        percentage,
        remaining: budget.amount - spent,
      };
    })
    .filter((alert) => alert.percentage >= 80 || alert.spent > 0);

  if (alerts.length === 0) {
    return null;
  }

  const criticalAlerts = alerts.filter((a) => a.percentage >= 100);
  const warningAlerts = alerts.filter((a) => a.percentage >= 80 && a.percentage < 100);
  const normalAlerts = alerts.filter((a) => a.percentage < 80);

  return (
    <div className="space-y-3">
      <h2 className="text-gray-700">预算概况</h2>
      
      {/* Critical Alerts */}
      {criticalAlerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-900">{alert.category}</span>
                <span className="text-red-900">已超支</span>
              </div>
              <div className="text-sm text-red-700 mb-2">
                已支出 ¥{alert.spent.toFixed(2)} / 预算 ¥{alert.amount.toFixed(2)}
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div
                  className="h-2 bg-red-600 rounded-full transition-all"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="text-xs text-red-700 mt-1">
                超支 ¥{Math.abs(alert.remaining).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Warning Alerts */}
      {warningAlerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-900">{alert.category}</span>
                <span className="text-orange-900">{alert.percentage.toFixed(0)}%</span>
              </div>
              <div className="text-sm text-orange-700 mb-2">
                已支出 ¥{alert.spent.toFixed(2)} / 预算 ¥{alert.amount.toFixed(2)}
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="h-2 bg-orange-600 rounded-full transition-all"
                  style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-orange-700 mt-1">
                剩余 ¥{alert.remaining.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Normal Progress */}
      {normalAlerts.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          {normalAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">{alert.category}</span>
                  <span className="text-sm text-gray-600">{alert.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all"
                    style={{ width: `${alert.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>¥{alert.spent.toFixed(2)}</span>
                  <span>剩余 ¥{alert.remaining.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
