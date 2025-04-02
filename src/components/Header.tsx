
import React from 'react';
import { Wallet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 mb-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
