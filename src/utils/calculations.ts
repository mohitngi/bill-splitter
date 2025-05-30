
import { Expense, Person, Balance, Settlement } from '@/types';

export const calculateBalances = (expenses: Expense[], people: Person[]): { [personId: string]: number } => {
  const balances: { [personId: string]: number } = {};
  
  // Initialize balances
  people.forEach(person => {
    balances[person.id] = 0;
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    // Person who paid gets credited
    balances[expense.paidBy] += expense.amount;
    
    // Each person who owes gets debited their share
    expense.splits.forEach(split => {
      balances[split.personId] -= split.amount;
    });
  });

  return balances;
};

export const calculateSettlements = (balances: { [personId: string]: number }): Settlement[] => {
  const settlements: Settlement[] = [];
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  // Separate creditors and debtors
  Object.entries(balances).forEach(([personId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ id: personId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: personId, amount: Math.abs(balance) });
    }
  });

  // Sort by amount (descending)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: parseFloat(settlementAmount.toFixed(2))
      });
    }

    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getPersonExpenses = (expenses: Expense[], personId: string): number => {
  return expenses
    .filter(expense => expense.paidBy === personId)
    .reduce((total, expense) => total + expense.amount, 0);
};
