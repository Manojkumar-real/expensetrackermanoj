
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Expense, useExpenses, getCategories } from '@/contexts/ExpenseContext';

interface ExpenseEditDialogProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

const ExpenseEditDialog: React.FC<ExpenseEditDialogProps> = ({ expense, isOpen, onClose }) => {
  const { editExpense } = useExpenses();
  const [amount, setAmount] = useState<string>(expense.amount.toString());
  const [category, setCategory] = useState<string>(expense.category);
  const [date, setDate] = useState<string>(expense.date);
  const [description, setDescription] = useState<string>(expense.description);
  const categories = getCategories();

  useEffect(() => {
    if (isOpen) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setDescription(expense.description);
    }
  }, [expense, isOpen]);

  const handleSubmit = () => {
    if (!amount || !category || !date || !description) {
      return;
    }
    
    editExpense(expense.id, {
      amount: parseFloat(amount),
      category,
      date,
      description
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount ($)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <div className="relative">
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseEditDialog;
