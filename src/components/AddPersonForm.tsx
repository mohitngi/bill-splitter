
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Person } from '@/types';

interface AddPersonFormProps {
  onAdd: (person: Omit<Person, 'id'>) => void;
  existingNames: string[];
}

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onAdd, existingNames }) => {
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !existingNames.includes(name.trim())) {
      onAdd({
        name: name.trim(),
        color: getRandomColor()
      });
      setName('');
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Add Person
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="Enter person's name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!name.trim() || existingNames.includes(name.trim())}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Add
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowForm(false);
            setName('');
          }}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
      {existingNames.includes(name.trim()) && name.trim() && (
        <p className="text-red-500 text-sm">This name already exists</p>
      )}
    </form>
  );
};

export default AddPersonForm;
