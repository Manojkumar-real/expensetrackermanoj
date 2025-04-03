import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Bot, ArrowRight } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your financial assistant. I can help you save money based on your spending habits. Try asking me things like 'How can I save money?' or 'Analyze my expenses'.", isBot: true, timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { expenses, currentCurrency, summary } = useExpenses();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const totalAmount = summary?.total || 0;
  const categorySummary = summary?.byCategory || {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = generateResponse(userMessage.text);
      setMessages(prev => [...prev, { text: botResponse, isBot: true, timestamp: new Date() }]);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    const highestCategory = Object.entries(categorySummary || {})
      .sort(([, a], [, b]) => Number(b) - Number(a))[0];
    
    if (!expenses || expenses.length === 0) {
      return "I don't see any expense data yet. Start tracking your expenses, and I'll provide personalized saving tips.";
    }

    if (lowercaseQuery.includes('save money') || lowercaseQuery.includes('saving tips')) {
      return `Based on your spending, here are some tips to save money:
      
1. Your highest expense category is ${highestCategory?.[0] || 'unknown'} (${currentCurrency === 'USD' ? '$' : '₹'}${Number(highestCategory?.[1]).toFixed(2) || 0}). Try to reduce spending in this area.
2. Set a budget for each category and stick to it.
3. Look for recurring subscriptions you might not need.
4. Consider meal planning to reduce food expenses.
5. Use cashback apps or credit cards with rewards for your regular purchases.`;
    }

    if (lowercaseQuery.includes('analyze') || lowercaseQuery.includes('spending') || lowercaseQuery.includes('expenses')) {
      return `Here's a quick analysis of your expenses:

1. You've tracked ${expenses.length} expenses totaling ${currentCurrency === 'USD' ? '$' : '₹'}${totalAmount.toFixed(2)}.
2. Your biggest expense category is ${highestCategory?.[0] || 'unknown'}.
3. ${expenses.length > 3 ? `Your most recent expense was "${expenses[0]?.description}" for ${currentCurrency === 'USD' ? '$' : '₹'}${Number(expenses[0]?.amount).toFixed(2)}.` : 'You have just started tracking expenses.'} 
4. ${expenses.some(e => e.amount > totalAmount * 0.3) ? 'I notice some large one-time expenses. Consider spreading out big purchases when possible.' : 'Your expenses seem evenly distributed, which is good for budgeting!'}`;
    }

    if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('plan')) {
      return `To create an effective budget plan:

1. Aim to save 20% of your income.
2. Allocate 50% for necessities (housing, food, utilities).
3. Use 30% for discretionary spending.
4. Based on your current spending patterns, you might want to reduce your ${highestCategory?.[0] || 'highest'} category expenses.
5. Set specific savings goals for motivation.`;
    }

    return `I'm here to help with your finances! You can ask me to:
- Analyze your expenses
- Provide saving tips
- Help with budget planning
- Identify areas to cut costs`;
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
      >
        <Sparkles size={24} />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot size={18} /> Financial Assistant
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 h-[350px] max-h-[50vh] overflow-y-auto">
            <div className="space-y-4 p-1">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`px-4 py-2 rounded-lg max-w-[80%] ${
                      message.isBot 
                        ? 'bg-secondary text-secondary-foreground rounded-tl-none' 
                        : 'bg-primary text-primary-foreground rounded-tr-none'
                    }`}
                  >
                    {message.isBot && <Bot size={16} className="inline-block mr-1 mb-1" />}
                    <div className="whitespace-pre-line">{message.text}</div>
                    <div className="text-xs opacity-70 text-right mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 pt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for money saving tips..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </Button>
          </div>
          
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              <ArrowRight size={12} />
              Try asking "How can I save money?" or "Analyze my expenses"
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBox;
