
import React from 'react';
import { Person } from '@/types';
import { User } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  balance: number;
  onRemove: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, balance, onRemove }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: person.color }}
          >
            <User size={16} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{person.name}</h3>
            <p className={`text-sm ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {balance > 0 ? `Owed $${balance.toFixed(2)}` : balance < 0 ? `Owes $${Math.abs(balance).toFixed(2)}` : 'Settled up'}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PersonCard;
