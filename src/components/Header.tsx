
import React from 'react';
import { Wallet, DollarSign, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/contexts/ExpenseContext';

const Header: React.FC = () => {
  const { currentCurrency, toggleCurrency } = useExpenses();
  
  return (
    <header className="py-6 mb-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleCurrency}
            className="flex items-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {currentCurrency === 'USD' ? (
              <>
                <DollarSign className="h-4 w-4" />
                <span>USD</span>
              </>
            ) : (
              <>
                <IndianRupee className="h-4 w-4" />
                <span>INR</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
