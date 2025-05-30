
import React from 'react';
import { Settlement, Person } from '@/types';
import { Button } from '@/components/ui/button';

interface SettlementSuggestionsProps {
  settlements: Settlement[];
  people: Person[];
  onMarkSettled: (settlement: Settlement) => void;
}

const SettlementSuggestions: React.FC<SettlementSuggestionsProps> = ({ 
  settlements, 
  people, 
  onMarkSettled 
}) => {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
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
          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {getPersonName(settlement.from)} pays {getPersonName(settlement.to)}
              </p>
              <p className="text-lg font-bold text-blue-700">${settlement.amount.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => onMarkSettled(settlement)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark Settled
            </Button>
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
