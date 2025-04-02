
import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, DollarSign, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ExpenseForm: React.FC = () => {
  const { addExpense, categories, addCategory, currentCurrency, conversionRate } = useExpenses();
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !date || !description) {
      return;
    }
    
    // Convert amount if needed (store in USD internally)
    let amountValue = parseFloat(amount);
    if (currentCurrency === 'INR') {
      amountValue = amountValue / conversionRate;
    }
    
    addExpense({
      amount: amountValue,
      category,
      date,
      description
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDescription('');
  };

  const handleAddCategory = () => {
    addCategory(newCategory);
    setNewCategory('');
    setIsAddingCategory(false);
    // Automatically select the new category
    setCategory(newCategory);
  };

  const getCurrencySymbol = () => currentCurrency === 'USD' ? '$' : '₹';
  const getDisplayAmount = (value: string) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    return currentCurrency === 'INR' ? (numValue * conversionRate).toFixed(2) : numValue.toFixed(2);
  };

  return (
    <Card className="w-full animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({getCurrencySymbol()})</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg pl-8"
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
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory} required>
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
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button type="button" size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new expense category to better organize your expenses.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input 
                      placeholder="Category name" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleAddCategory} 
                      disabled={!newCategory.trim()}
                    >
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Input
                id="date"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
