import { useState } from 'react';
import { Transaction, Category } from '../App';
import { X, Plus } from 'lucide-react';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
}

export function AddTransactionModal({ onClose, onAdd, categories, onAddCategory }: AddTransactionModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = () => {
    if (!amount || !category) {
      return;
    }

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      note: note || category,
      date: new Date(),
    });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        type: type,
      });
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2>添加账单</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              type === 'expense'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              type === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            收入
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">金额</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">¥</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-2xl outline-none"
              step="0.01"
            />
          </div>
          <div className="h-px bg-gray-200 mt-2" />
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-3">分类</label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.name)}
                className={`py-3 rounded-xl transition-all ${
                  category === cat.name
                    ? type === 'expense'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => setShowAddCategory(true)}
              className="py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">添加</span>
            </button>
          </div>
        </div>

        {/* Add Category Input */}
        {showAddCategory && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <label className="block text-sm text-gray-600 mb-2">新分类名称</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入分类名称"
                className="flex-1 px-4 py-2 bg-white rounded-lg outline-none border border-gray-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewCategory();
                  }
                }}
              />
              <button
                onClick={handleAddNewCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                确定
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Note Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">备注</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加备注信息"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !category}
          className={`w-full py-4 rounded-xl transition-all ${
            amount && category
              ? type === 'expense'
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          确认添加
        </button>
      </div>
    </div>
  );
}