import React, { useState, useEffect } from 'react';
import { Person, Expense, Settlement } from '@/types';
import PersonCard from '@/components/PersonCard';
import ExpenseCard from '@/components/ExpenseCard';
import AddPersonForm from '@/components/AddPersonForm';
import AddExpenseForm from '@/components/AddExpenseForm';
import SettlementSuggestions from '@/components/SettlementSuggestions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateBalances, calculateSettlements, getTotalExpenses } from '@/utils/calculations';
import { Plus, Users, DollarSign, FileText } from 'lucide-react';

const Index = () => {
  const [people, setPeople] = useState<Person[]>(() => {
    const savedPeople = localStorage.getItem('people');
    return savedPeople ? JSON.parse(savedPeople) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Save people to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  const balances = calculateBalances(expenses, people);
  const settlements = calculateSettlements(balances);
  const totalExpenses = getTotalExpenses(expenses);

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      ...personData
    };
    setPeople(prev => [...prev, newPerson]);
  };

  const removePerson = (personId: string) => {
    // Check if person has expenses
    const hasExpenses = expenses.some(expense => 
      expense.paidBy === personId || 
      expense.splits.some(split => split.personId === personId)
    );

    if (hasExpenses) {
      alert('Cannot remove person with existing expenses. Please delete related expenses first.');
      return;
    }

    setPeople(prev => prev.filter(p => p.id !== personId));
  };

  const addExpense = (expenseData: {
    title: string;
    amount: number;
    paidBy: string;
    splits: { personId: string; amount: number }[];
    category: string;
    description?: string;
  }) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date(),
      ...expenseData
    };
    setExpenses(prev => [...prev, newExpense]);
    setShowAddExpense(false);
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const markSettled = (settlement: Settlement) => {
    // Add a settlement expense
    const settlementExpense: Expense = {
      id: Date.now().toString(),
      title: 'Settlement Payment',
      amount: settlement.amount,
      paidBy: settlement.from,
      splits: [{ personId: settlement.to, amount: settlement.amount }],
      category: 'Other',
      date: new Date(),
      description: 'Settlement payment'
    };
    setExpenses(prev => [...prev, settlementExpense]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bill Splitter</h1>
              <p className="text-gray-600">Track expenses and split bills with friends</p>
            </div>
            <div className="flex items-center gap-6 text-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${totalExpenses.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{people.length}</p>
                <p className="text-sm text-gray-500">People</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="expenses" className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="expenses" className="flex items-center justify-center gap-2">
              <DollarSign size={16} />
              <span>Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center justify-center gap-2">
              <Users size={16} />
              <span>People</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center justify-center gap-2">
              <FileText size={16} />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            {people.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-amber-800 mb-1">Add People First</h3>
                <p className="text-amber-700 text-sm">You need to add people before you can record expenses.</p>
              </div>
            ) : showAddExpense ? (
              <AddExpenseForm 
                people={people}
                onAdd={addExpense}
                onCancel={() => setShowAddExpense(false)}
              />
            ) : (
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-6"
              >
                <Plus size={20} />
                <span>Add New Expense</span>
              </Button>
            )}

            {expenses.length === 0 && !showAddExpense && people.length > 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-gray-500 mb-2">No expenses yet</h3>
                <p className="text-gray-400">Click "Add New Expense" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.slice().reverse().map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    people={people}
                    onEdit={() => {}} // To be implemented
                    onDelete={() => deleteExpense(expense.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <AddPersonForm 
                  onAdd={addPerson}
                  existingNames={people.map(p => p.name)}
                />
              </div>
              {people.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  balance={balances[person.id] || 0}
                  onRemove={() => removePerson(person.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {people.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-amber-800 mb-1">Add People First</h3>
                <p className="text-amber-700 text-sm">You need to add people before you can see the summary.</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-1">Add Expenses First</h3>
                <p className="text-blue-700 text-sm">You need to add expenses to see balances and settlements.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Current Balances</h3>
                    {people.map(person => (
                      <div key={person.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: person.color }}
                          />
                          <span>{person.name}</span>
                        </div>
                        <span className={`font-medium ${balances[person.id] > 0 ? 'text-green-600' : balances[person.id] < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {balances[person.id] > 0 ? '+' : ''}{balances[person.id].toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <SettlementSuggestions
                    settlements={settlements}
                    people={people}
                    onMarkSettled={markSettled}
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
