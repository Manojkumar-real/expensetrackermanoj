
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, IndianRupee } from 'lucide-react';
import { Expense, useExpenses } from '@/contexts/ExpenseContext';

interface ExpenseEditDialogProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

const ExpenseEditDialog: React.FC<ExpenseEditDialogProps> = ({ expense, isOpen, onClose }) => {
  const { editExpense, categories, currentCurrency, conversionRate } = useExpenses();
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(expense.category);
  const [date, setDate] = useState<string>(expense.date);
  const [description, setDescription] = useState<string>(expense.description);

  useEffect(() => {
    if (isOpen) {
      // Display amount in the current currency
      const displayAmount = currentCurrency === 'INR' 
        ? (expense.amount * conversionRate).toString()
        : expense.amount.toString();
      
      setAmount(displayAmount);
      setCategory(expense.category);
      setDate(expense.date);
      setDescription(expense.description);
    }
  }, [expense, isOpen, currentCurrency, conversionRate]);

  const handleSubmit = () => {
    if (!amount || !category || !date || !description) {
      return;
    }
    
    // Convert amount if needed (store in USD internally)
    let amountValue = parseFloat(amount);
    if (currentCurrency === 'INR') {
      amountValue = amountValue / conversionRate;
    }
    
    editExpense(expense.id, {
      amount: amountValue,
      category,
      date,
      description
    });
    
    onClose();
  };

  const getCurrencySymbol = () => currentCurrency === 'USD' ? '$' : '₹';

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
            <Label htmlFor="edit-amount">Amount ({getCurrencySymbol()})</Label>
            <div className="relative">
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg"
                required
              />
              <div className="absolute left-3 top-2.5">
                {currentCurrency === 'USD' ? (
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            
            {amount && currentCurrency === 'INR' && (
              <div className="text-xs text-muted-foreground">
                Approx ${(parseFloat(amount) / conversionRate).toFixed(2)} USD
              </div>
            )}
            {amount && currentCurrency === 'USD' && (
              <div className="text-xs text-muted-foreground">
                Approx ₹{(parseFloat(amount) * conversionRate).toFixed(2)} INR
              </div>
            )}
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
