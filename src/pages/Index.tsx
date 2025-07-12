
import React from 'react';
import { Link } from 'react-router-dom';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ExpenseDashboard from '@/components/ExpenseDashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SavingsAnalyzer from '@/components/SavingsAnalyzer';

const Index: React.FC = () => {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pb-16">
          <div className="mb-6 text-center">
            <Link to="/portfolio">
              <Button variant="outline">View Portfolio</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2">
              <ExpenseDashboard />
            </div>
            <div>
              <ExpenseForm />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <ExpenseList />
            <SavingsAnalyzer />
          </div>
        </main>
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Expense Tracker - Built with React & Tailwind CSS
          </div>
        </footer>
      </div>
    </ExpenseProvider>
  );
};

export default Index;
