
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

export type ExpenseSummary = {
  total: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
};

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Omit<Expense, 'id'>) => void;
  summary: ExpenseSummary;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const CATEGORIES = [
  'Food & Dining', 
  'Shopping', 
  'Housing', 
  'Transportation', 
  'Entertainment',
  'Healthcare', 
  'Personal Care',
  'Education',
  'Travel',
  'Utilities',
  'Other'
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 45.99,
    category: 'Food & Dining',
    date: '2023-06-15',
    description: 'Grocery shopping'
  },
  {
    id: '2',
    amount: 12.50,
    category: 'Entertainment',
    date: '2023-06-17',
    description: 'Movie ticket'
  },
  {
    id: '3',
    amount: 65.00,
    category: 'Transportation',
    date: '2023-06-12',
    description: 'Gas refill'
  },
  {
    id: '4',
    amount: 129.99,
    category: 'Shopping',
    date: '2023-06-10',
    description: 'New shoes'
  },
  {
    id: '5',
    amount: 35.20,
    category: 'Food & Dining',
    date: '2023-05-28',
    description: 'Restaurant dinner'
  },
  {
    id: '6',
    amount: 89.99,
    category: 'Utilities',
    date: '2023-05-25',
    description: 'Electricity bill'
  },
  {
    id: '7',
    amount: 199.00,
    category: 'Healthcare',
    date: '2023-06-05',
    description: 'Doctor appointment'
  },
  {
    id: '8',
    amount: 49.99,
    category: 'Entertainment',
    date: '2023-05-20',
    description: 'Video game'
  },
];

export const getCategories = () => CATEGORIES;

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    byCategory: {},
    byMonth: {},
  });
  const { toast } = useToast();

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        // Use mock data for demo purposes
        setExpenses(MOCK_EXPENSES);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses(MOCK_EXPENSES);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      calculateSummary();
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, [expenses]);

  const calculateSummary = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const byCategory: Record<string, number> = {};
    expenses.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });
    
    const byMonth: Record<string, number> = {};
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // Format: YYYY-MM
      byMonth[month] = (byMonth[month] || 0) + expense.amount;
    });
    
    setSummary({ total, byCategory, byMonth });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: "Expense Added",
      description: `$${expense.amount.toFixed(2)} for ${expense.description}`,
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed",
    });
  };

  const editExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...updatedExpense, id } 
          : expense
      )
    );
    toast({
      title: "Expense Updated",
      description: `Updated: ${updatedExpense.description}`,
    });
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, editExpense, summary }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
