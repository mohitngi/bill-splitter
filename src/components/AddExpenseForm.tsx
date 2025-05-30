
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Person, ExpenseSplit } from '@/types';

interface AddExpenseFormProps {
  people: Person[];
  onAdd: (expense: {
    title: string;
    amount: number;
    paidBy: string;
    splits: ExpenseSplit[];
    category: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ people, onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [personId: string]: string }>({});

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];

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
    
    if (!title.trim() || !amount || !paidBy || !category) return;
    
    if (splitMethod === 'custom' && !isCustomSplitsValid()) return;

    const splits = calculateSplits();
    
    onAdd({
      title: title.trim(),
      amount: parseFloat(amount),
      paidBy,
      splits,
      category,
      description: description.trim() || undefined
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input
            type="text"
            placeholder="What was this expense for?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Split Method</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="equal"
                checked={splitMethod === 'equal'}
                onChange={(e) => setSplitMethod(e.target.value as 'equal')}
                className="mr-2"
              />
              Split Equally
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={splitMethod === 'custom'}
                onChange={(e) => setSplitMethod(e.target.value as 'custom')}
                className="mr-2"
              />
              Custom Split
            </label>
          </div>

          {splitMethod === 'custom' && (
            <div className="space-y-2">
              <div className="grid gap-2">
                {people.map(person => (
                  <div key={person.id} className="flex items-center justify-between">
                    <span className="text-sm">{person.name}</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={customSplits[person.id] || ''}
                      onChange={(e) => handleCustomSplitChange(person.id, e.target.value)}
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Total: ${getTotalCustomSplits().toFixed(2)} / ${amount || '0.00'}
                {splitMethod === 'custom' && amount && !isCustomSplitsValid() && (
                  <span className="text-red-500 block">Splits must equal total amount</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <Textarea
            placeholder="Add any additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!title.trim() || !amount || !paidBy || !category || (splitMethod === 'custom' && !isCustomSplitsValid())}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Add Expense
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
    </div>
  );
};

export default AddExpenseForm;
