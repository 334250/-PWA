import { Transaction, Category } from '../App';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, categories, onEdit, onDelete }: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const dateKey = transaction.date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    if (dateStr === today) {
      return '今天';
    }
    
    return dateStr;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, items]) => (
        <div key={date}>
          <div className="text-sm text-gray-500 mb-3 px-2">{formatDateLabel(date)}</div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {items.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                categories={categories}
                onEdit={() => onEdit(transaction)}
                onDelete={() => onDelete(transaction.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}