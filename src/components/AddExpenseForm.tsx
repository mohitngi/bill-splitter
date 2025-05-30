import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Person, ExpenseSplit, Expense } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { currencies } from '@/components/CurrencySelector';

interface AddExpenseFormProps {
  people: Person[];
  currency: string;
  onAdd: (expense: {
    title: string;
    amount: number;
    paidBy: string;
    splits: ExpenseSplit[];
    category: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  initialData?: Expense | null;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ 
  people, 
  currency, 
  onAdd, 
  onCancel,
  initialData 
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [personId: string]: string }>({});

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setPaidBy(initialData.paidBy);
      setCategory(initialData.category);
      setDescription(initialData.description || '');
      
      // Check if splits are equal or custom
      const splitAmounts = initialData.splits.map(split => split.amount);
      const isEqualSplit = splitAmounts.every(amount => 
        Math.abs(amount - splitAmounts[0]) < 0.01
      );
      
      if (isEqualSplit) {
        setSplitMethod('equal');
      } else {
        setSplitMethod('custom');
        const customSplitsMap: { [personId: string]: string } = {};
        initialData.splits.forEach(split => {
          customSplitsMap[split.personId] = split.amount.toString();
        });
        setCustomSplits(customSplitsMap);
      }
    }
  }, [initialData]);

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];
  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];

  const handleCustomSplitChange = (personId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [personId]: value
    }));
  };

  const calculateSplits = (): ExpenseSplit[] => {
    const totalAmount = parseFloat(amount) || 0;
    
    if (splitMethod === 'equal') {
      const splitAmount = totalAmount / people.length;
      return people.map(person => ({
        personId: person.id,
        amount: parseFloat(splitAmount.toFixed(2))
      }));
    } else {
      return people.map(person => ({
        personId: person.id,
        amount: parseFloat(customSplits[person.id] || '0')
      }));
    }
  };

  const getTotalCustomSplits = () => {
    return Object.values(customSplits).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const isCustomSplitsValid = () => {
    const totalCustom = getTotalCustomSplits();
    const totalAmount = parseFloat(amount) || 0;
    return Math.abs(totalCustom - totalAmount) < 0.01;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !paidBy || !category) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      paidBy,
      splits: calculateSplits(),
      category,
      description: description || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <Input
          type="text"
          placeholder="What's the expense for?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {selectedCurrency.symbol}
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
        <Select value={paidBy} onValueChange={setPaidBy} required>
          <SelectTrigger>
            <SelectValue placeholder="Who paid?" />
          </SelectTrigger>
          <SelectContent>
            {people.map(person => (
              <SelectItem key={person.id} value={person.id}>
                {person.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <Textarea
          placeholder="Add any additional details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Split Method</label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={splitMethod === 'equal' ? 'default' : 'outline'}
            onClick={() => setSplitMethod('equal')}
          >
            Equal Split
          </Button>
          <Button
            type="button"
            variant={splitMethod === 'custom' ? 'default' : 'outline'}
            onClick={() => setSplitMethod('custom')}
          >
            Custom Split
          </Button>
        </div>
      </div>

      {splitMethod === 'custom' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Custom Split Amounts</label>
          {people.map(person => (
            <div key={person.id} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-24">{person.name}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customSplits[person.id] || ''}
                  onChange={(e) => handleCustomSplitChange(person.id, e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total:</span>
            <span className={`font-medium ${isCustomSplitsValid() ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getTotalCustomSplits(), currency)}
            </span>
          </div>
          {!isCustomSplitsValid() && (
            <p className="text-sm text-red-600">
              Total split amount must equal {formatCurrency(parseFloat(amount) || 0, currency)}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!title || !amount || !paidBy || !category || (splitMethod === 'custom' && !isCustomSplitsValid())}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
