
export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface ExpenseSplit {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splits: ExpenseSplit[];
  category: string;
  date: Date;
  description?: string;
}

export interface Balance {
  from: string;
  to: string;
  amount: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
