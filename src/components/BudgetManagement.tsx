import { useState } from 'react';
import { Budget, Category } from '../App';
import { Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react';

interface BudgetManagementProps {
  budgets: Budget[];
  categories: Category[];
  monthlyExpenses: Record<string, number>;
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (budgetId: string, amount: number) => void;
  onDeleteBudget: (budgetId: string) => void;
}

export function BudgetManagement({
  budgets,
  categories,
  monthlyExpenses,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}: BudgetManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = () => {
    if (newBudgetCategory && newBudgetAmount && parseFloat(newBudgetAmount) > 0) {
      onAddBudget({
        category: newBudgetCategory,
        amount: parseFloat(newBudgetAmount),
        period: 'monthly',
      });
      setNewBudgetCategory('');
      setNewBudgetAmount('');
      setShowAddForm(false);
    }
  };

  const handleEdit = (budgetId: string, currentAmount: number) => {
    setEditingId(budgetId);
    setEditAmount(currentAmount.toString());
  };

  const handleSave = (budgetId: string) => {
    if (editAmount && parseFloat(editAmount) > 0) {
      onUpdateBudget(budgetId, parseFloat(editAmount));
      setEditingId(null);
      setEditAmount('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const availableCategories = categories.filter(
    (cat) => !budgets.some((b) => b.category === cat.name)
  );

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(monthlyExpenses).reduce((sum, amount) => sum + amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <h1 className="mb-4">预算管理</h1>
        
        {/* Total Budget Summary */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">本月总预算</span>
            <span className="text-xl">¥{totalBudget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">已支出</span>
            <span className="text-xl">¥{totalSpent.toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/30" />
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">剩余预算</span>
            <span className={`text-2xl ${totalRemaining < 0 ? 'text-red-200' : ''}`}>
              ¥{totalRemaining.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                totalSpent > totalBudget ? 'bg-red-400' : 'bg-white'
              }`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Add Budget Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="mb-3 text-gray-700">添加预算</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-2">选择分类</label>
                <select
                  value={newBudgetCategory}
                  onChange={(e) => setNewBudgetCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg outline-none"
                >
                  <option value="">请选择分类</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">预算金额</label>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <span>¥</span>
                  <input
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent outline-none"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg"
                >
                  添加
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBudgetCategory('');
                    setNewBudgetAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && availableCategories.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 bg-emerald-500 text-white transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>添加预算</span>
          </button>
        )}

        {/* Budget List */}
        <div className="space-y-3 mb-6">
          {budgets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无预算设置</p>
              <p className="text-sm mt-1">点击上方按钮添加预算</p>
            </div>
          ) : (
            budgets.map((budget) => {
              const spent = monthlyExpenses[budget.category] || 0;
              const percentage = (spent / budget.amount) * 100;
              const remaining = budget.amount - spent;
              const isEditing = editingId === budget.id;

              return (
                <div
                  key={budget.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    percentage >= 100
                      ? 'border-2 border-red-200'
                      : percentage >= 80
                      ? 'border-2 border-orange-200'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900">{budget.category}</span>
                        {percentage >= 100 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            已超支
                          </span>
                        )}
                        {percentage >= 80 && percentage < 100 && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                            预警
                          </span>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">¥</span>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none"
                            step="0.01"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          预算 ¥{budget.amount.toFixed(2)} / 月
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(budget.id)}
                            className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(budget.id, budget.amount)}
                            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBudget(budget.id)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        已支出 ¥{spent.toFixed(2)}
                      </span>
                      <span
                        className={
                          remaining < 0
                            ? 'text-red-600'
                            : remaining < budget.amount * 0.2
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }
                      >
                        {remaining >= 0 ? '剩余' : '超支'} ¥{Math.abs(remaining).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 100
                            ? 'bg-red-500'
                            : percentage >= 80
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
