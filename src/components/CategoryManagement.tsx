import { useState } from 'react';
import { Category } from '../App';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoryManagement({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagementProps) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        type: activeTab,
      });
      setNewCategoryName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <h1 className="mb-4">分类管理</h1>
        <p className="text-sm opacity-90">管理您的收入和支出分类</p>
      </div>

      {/* Type Toggle */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'expense'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            支出分类
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            收入分类
          </button>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <label className="block text-sm text-gray-600 mb-2">新分类名称</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入分类名称"
                className="flex-1 px-4 py-2 bg-gray-50 rounded-lg outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAdd();
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleAdd}
                className={`px-4 py-2 rounded-lg text-white ${
                  activeTab === 'expense' ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                添加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className={`w-full py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'expense'
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>添加新分类</span>
          </button>
        )}

        {/* Categories List */}
        <div className="space-y-2 mb-6">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无分类</p>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeTab === 'expense'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {cat.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-gray-900">{cat.name}</div>
                    {cat.isDefault && (
                      <div className="text-xs text-gray-400">系统默认</div>
                    )}
                  </div>
                </div>

                {!cat.isDefault && (
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
