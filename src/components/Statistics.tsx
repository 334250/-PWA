import { useState } from 'react';
import { Transaction, Category } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Calendar } from 'lucide-react';

interface StatisticsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function Statistics({ transactions, categories }: StatisticsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  // Calculate total income and expense
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate expense by category
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Calculate income by category
  const incomeByCategory = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Get last 6 months data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(selectedYear, selectedMonth - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month: `${month + 1}月`,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
    });
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <h1 className="mb-4">数据统计</h1>
        
        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <Calendar className="w-5 h-5" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent outline-none"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year} className="text-gray-900">
                {year}年
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-transparent outline-none"
          >
            {months.map((month, index) => (
              <option key={index} value={index} className="text-gray-900">
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">收入</span>
            </div>
            <div className="text-2xl">¥{totalIncome.toFixed(2)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">支出</span>
            </div>
            <div className="text-2xl">¥{totalExpense.toFixed(2)}</div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="mb-4 text-gray-700">近6个月趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10b981" name="收入" />
              <Bar dataKey="expense" fill="#ef4444" name="支出" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie Chart */}
        {expensePieData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="mb-4 text-gray-700">支出分类占比</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Expense Category List */}
            <div className="mt-4 space-y-2">
              {Object.entries(expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], index) => {
                  const percentage = (amount / totalExpense) * 100;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">{category}</span>
                          <span className="text-sm">¥{amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Income Pie Chart */}
        {incomePieData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="mb-4 text-gray-700">收入分类占比</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Income Category List */}
            <div className="mt-4 space-y-2">
              {Object.entries(incomeByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], index) => {
                  const percentage = (amount / totalIncome) * 100;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">{category}</span>
                          <span className="text-sm">¥{amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {expensePieData.length === 0 && incomePieData.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>本月暂无数据</p>
            <p className="text-sm mt-1">添加账单后即可查看统计</p>
          </div>
        )}
      </div>
    </div>
  );
}
