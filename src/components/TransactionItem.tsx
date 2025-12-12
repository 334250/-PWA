import { Transaction } from '../App';
import { ShoppingBag, Coffee, Car, Wallet, Home, Heart, Gift, FileText } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
}

const categoryIcons: Record<string, React.ReactNode> = {
  '餐饮': <Coffee className="w-5 h-5" />,
  '交通': <Car className="w-5 h-5" />,
  '购物': <ShoppingBag className="w-5 h-5" />,
  '工资': <Wallet className="w-5 h-5" />,
  '居住': <Home className="w-5 h-5" />,
  '娱乐': <Heart className="w-5 h-5" />,
  '礼物': <Gift className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  '餐饮': 'bg-orange-100 text-orange-600',
  '交通': 'bg-blue-100 text-blue-600',
  '购物': 'bg-purple-100 text-purple-600',
  '工资': 'bg-green-100 text-green-600',
  '居住': 'bg-yellow-100 text-yellow-600',
  '娱乐': 'bg-pink-100 text-pink-600',
  '礼物': 'bg-red-100 text-red-600',
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const icon = categoryIcons[transaction.category] || <FileText className="w-5 h-5" />;
  const colorClass = categoryColors[transaction.category] || 'bg-gray-100 text-gray-600';

  const time = transaction.date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center gap-4 p-4 active:bg-gray-50 transition-colors">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-900">{transaction.category}</span>
        </div>
        <div className="text-sm text-gray-500">
          {transaction.note} · {time}
        </div>
      </div>
      
      <div className={transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}>
        {transaction.type === 'income' ? '+' : '-'}¥ {transaction.amount.toFixed(2)}
      </div>
    </div>
  );
}
