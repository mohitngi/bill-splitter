import React from 'react';
import { Settlement, Person } from '@/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currency';

interface SettlementSuggestionsProps {
  settlements: Settlement[];
  people: Person[];
  currency: string;
  onMarkSettled: (settlement: Settlement) => void;
}

const SettlementSuggestions: React.FC<SettlementSuggestionsProps> = ({
  settlements,
  people,
  currency,
  onMarkSettled
}) => {
  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  if (settlements.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-2">🎉 All Settled Up!</h3>
        <p className="text-green-700 text-sm">Everyone's balances are even. No settlements needed!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-4">Settlement Suggestions</h3>
      <div className="space-y-3">
        {settlements.map((settlement, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center gap-2">
              <div className="text-gray-600">
                <span className="font-medium">{getPersonName(settlement.from)}</span>
                {' → '}
                <span className="font-medium">{getPersonName(settlement.to)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                {formatCurrency(settlement.amount, currency)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkSettled(settlement)}
              >
                Mark as Paid
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        These suggestions minimize the number of transactions needed to settle all balances.
      </p>
    </div>
  );
};

export default SettlementSuggestions;
