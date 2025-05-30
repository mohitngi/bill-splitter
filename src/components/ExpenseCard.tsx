
import React from 'react';
import { Expense, Person } from '@/types';
import { Calendar, User } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, people, onEdit, onDelete }) => {
  const paidByPerson = people.find(p => p.id === expense.paidBy);
  
  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900">{expense.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">${expense.amount.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-500 transition-colors px-2 py-1"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>Paid by {paidByPerson?.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{expense.date.toLocaleDateString()}</span>
        </div>
      </div>

      {expense.description && (
        <p className="text-sm text-gray-600 mb-3">{expense.description}</p>
      )}

      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Split Details</p>
        {expense.splits.map(split => {
          const person = people.find(p => p.id === split.personId);
          return (
            <div key={split.personId} className="flex justify-between text-sm">
              <span className="text-gray-600">{person?.name}</span>
              <span className="font-medium">${split.amount.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseCard;
