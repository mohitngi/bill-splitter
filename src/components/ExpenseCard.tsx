import React from 'react';
import { Person, Expense } from '@/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { Trash2 } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, people, currency, onEdit, onDelete }) => {
  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{expense.title}</h3>
          <p className="text-sm text-gray-500">{expense.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="text-gray-500">Paid by: </span>
              <span className="font-medium">{getPersonName(expense.paidBy)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Category: </span>
              <span className="font-medium">{expense.category}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Date: </span>
              <span className="font-medium">
                {expense.date.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(expense.amount, currency)}
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-medium text-gray-900 mb-2">Split between:</p>
        <div className="space-y-1">
          {expense.splits.map((split, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{getPersonName(split.personId)}</span>
              <span className="font-medium">{formatCurrency(split.amount, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
