import { useState, useEffect } from 'react';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { StatsSummary } from './components/StatsSummary';
import { CategoryManagement } from './components/CategoryManagement';
import { Statistics } from './components/Statistics';
import { BudgetManagement } from './components/BudgetManagement';
import { BudgetAlert } from './components/BudgetAlert';
import { Plus, Home, FolderOpen, BarChart3, Wallet, RotateCcw } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
}

const defaultExpenseCategories: Category[] = [
  { id: '1', name: '餐饮', type: 'expense', isDefault: true },
  { id: '3', name: '购物', type: 'expense', isDefault: true },
  { id: '4', name: '居住', type: 'expense', isDefault: true },
  { id: '5', name: '娱乐', type: 'expense', isDefault: true },
  { id: '6', name: '医疗', type: 'expense', isDefault: true },
  { id: '8', name: '其他', type: 'expense', isDefault: true },
];

const defaultIncomeCategories: Category[] = [
  { id: '9', name: '工资', type: 'income', isDefault: true },
  { id: '14', name: '其他', type: 'income', isDefault: true },
];

const defaultBudgets: Budget[] = [];

const defaultTransactions: Transaction[] = [];

const loadFromStorage = <T,>(key: string, defaultValue: T, dateFields: string[] = []): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (dateFields.length > 0 && Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          const newItem = { ...item };
          dateFields.forEach(field => {
            if (newItem[field]) {
              newItem[field] = new Date(newItem[field]);
            }
          });
          return newItem;
        }) as unknown as T;
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading ${key} from storage`, e);
  }
  return defaultValue;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'category' | 'statistics' | 'budget'>('home');
  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromStorage('categories', [
      ...defaultExpenseCategories,
      ...defaultIncomeCategories,
    ])
  );
  
  const [budgets, setBudgets] = useState<Budget[]>(() => 
    loadFromStorage('budgets', defaultBudgets)
  );
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage('transactions', defaultTransactions, ['date'])
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleResetData = () => {
    if (window.confirm('确定要重置所有数据吗？这将清除所有记录并恢复到初始状态。')) {
      // Clear localStorage
      localStorage.removeItem('categories');
      localStorage.removeItem('budgets');
      localStorage.removeItem('transactions');
      
      // Reset state to defaults
      setCategories([...defaultExpenseCategories, ...defaultIncomeCategories]);
      setBudgets(defaultBudgets);
      setTransactions(defaultTransactions);
    }
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      isDefault: false,
    };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
  };

  const handleAddBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    setBudgets([...budgets, newBudget]);
  };

  const handleUpdateBudget = (budgetId: string, amount: number) => {
    setBudgets(budgets.map((b) => (b.id === budgetId ? { ...b, amount } : b)));
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter((b) => b.id !== budgetId));
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate current month expenses by category
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === 'expense' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentTab === 'home' ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1>我的账本</h1>
              {/* <button 
                onClick={handleResetData}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                title="重置数据"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button> */}
            </div>
            <StatsSummary income={totalIncome} expense={totalExpense} />
          </div>

          {/* Budget Alert */}
          <div className="px-4 mt-6">
            <BudgetAlert budgets={budgets} monthlyExpenses={monthlyExpenses} />
          </div>

          {/* Transactions List */}
          <div className="px-4 mt-6">
            <h2 className="mb-4 text-gray-700">账单明细</h2>
            <TransactionList transactions={transactions} />
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed right-6 bottom-20 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Add Transaction Modal */}
          {isModalOpen && (
            <AddTransactionModal
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddTransaction}
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          )}
        </>
      ) : currentTab === 'statistics' ? (
        <Statistics transactions={transactions} categories={categories} />
      ) : currentTab === 'budget' ? (
        <BudgetManagement
          budgets={budgets}
          categories={categories.filter((c) => c.type === 'expense')}
          monthlyExpenses={monthlyExpenses}
          onAddBudget={handleAddBudget}
          onUpdateBudget={handleUpdateBudget}
          onDeleteBudget={handleDeleteBudget}
        />
      ) : (
        <CategoryManagement
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 flex justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
            currentTab === 'home' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">首页</span>
        </button>
        <button
          onClick={() => setCurrentTab('statistics')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
            currentTab === 'statistics' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs">统计</span>
        </button>
        <button
          onClick={() => setCurrentTab('budget')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
            currentTab === 'budget' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs">预算</span>
        </button>
        <button
          onClick={() => setCurrentTab('category')}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
            currentTab === 'category' ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <FolderOpen className="w-6 h-6" />
          <span className="text-xs">分类</span>
        </button>
      </div>
    </div>
  );
}