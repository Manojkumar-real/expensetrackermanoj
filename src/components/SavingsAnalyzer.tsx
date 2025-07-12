
import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Lightbulb, PiggyBank, BarChart3 } from 'lucide-react';

interface SavingsInsight {
  category: string;
  currentSpending: number;
  suggestedBudget: number;
  potentialSavings: number;
  confidence: number;
  tips: string[];
}

interface SpendingPattern {
  category: string;
  avgMonthly: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number;
}

const SavingsAnalyzer: React.FC = () => {
  const { expenses, summary, currentCurrency, conversionRate } = useExpenses();
  const [insights, setInsights] = useState<SavingsInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalPotentialSavings, setTotalPotentialSavings] = useState(0);

  const analyzeExpenses = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const patterns = analyzeSpendingPatterns();
      const generatedInsights = generateSavingsInsights(patterns);
      setInsights(generatedInsights);
      
      const totalSavings = generatedInsights.reduce((sum, insight) => sum + insight.potentialSavings, 0);
      setTotalPotentialSavings(totalSavings);
      
      setIsAnalyzing(false);
    }, 2000); // Simulate ML processing time
  };

  const analyzeSpendingPatterns = (): SpendingPattern[] => {
    const categorySpending: Record<string, number[]> = {};
    const monthlyData: Record<string, Record<string, number>> = {};

    // Group expenses by month and category
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      const category = expense.category;
      
      if (!monthlyData[month]) monthlyData[month] = {};
      if (!monthlyData[month][category]) monthlyData[month][category] = 0;
      
      monthlyData[month][category] += expense.amount;
    });

    // Calculate patterns for each category
    Object.keys(summary.byCategory).forEach(category => {
      const monthlyAmounts = Object.values(monthlyData).map(month => month[category] || 0);
      categorySpending[category] = monthlyAmounts;
    });

    return Object.entries(categorySpending).map(([category, amounts]) => {
      const avgMonthly = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      const variance = calculateVariance(amounts, avgMonthly);
      const trend = calculateTrend(amounts);

      return {
        category,
        avgMonthly,
        trend,
        variance
      };
    });
  };

  const calculateVariance = (amounts: number[], average: number): number => {
    const squaredDiffs = amounts.map(amt => Math.pow(amt - average, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / amounts.length;
  };

  const calculateTrend = (amounts: number[]): 'increasing' | 'decreasing' | 'stable' => {
    if (amounts.length < 2) return 'stable';
    
    const firstHalf = amounts.slice(0, Math.floor(amounts.length / 2));
    const secondHalf = amounts.slice(Math.floor(amounts.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, amt) => sum + amt, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, amt) => sum + amt, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    if (Math.abs(diff) < firstAvg * 0.1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  };

  const generateSavingsInsights = (patterns: SpendingPattern[]): SavingsInsight[] => {
    return patterns
      .filter(pattern => pattern.avgMonthly > 20) // Focus on meaningful spending
      .sort((a, b) => b.avgMonthly - a.avgMonthly)
      .slice(0, 5) // Top 5 categories
      .map(pattern => {
        const currentSpending = pattern.avgMonthly;
        let potentialReduction = 0;
        let confidence = 60;
        const tips: string[] = [];

        // ML-inspired logic based on spending patterns
        if (pattern.trend === 'increasing') {
          potentialReduction = currentSpending * 0.15;
          confidence += 20;
          tips.push(`Your ${pattern.category} spending is trending upward. Consider setting a monthly limit.`);
        }

        if (pattern.variance > currentSpending * 0.5) {
          potentialReduction += currentSpending * 0.1;
          confidence += 15;
          tips.push(`High variance in ${pattern.category} spending suggests opportunities for better budgeting.`);
        }

        // Category-specific insights
        switch (pattern.category.toLowerCase()) {
          case 'food & dining':
            potentialReduction += currentSpending * 0.2;
            tips.push('Try meal planning and cooking at home more often.');
            tips.push('Look for restaurant deals and happy hour specials.');
            break;
          case 'entertainment':
            potentialReduction += currentSpending * 0.25;
            tips.push('Consider free or low-cost entertainment alternatives.');
            tips.push('Look for subscription services you might not be using.');
            break;
          case 'shopping':
            potentialReduction += currentSpending * 0.3;
            tips.push('Implement a 24-hour wait rule before non-essential purchases.');
            tips.push('Compare prices across different retailers.');
            break;
          case 'transportation':
            potentialReduction += currentSpending * 0.15;
            tips.push('Consider carpooling or public transportation options.');
            tips.push('Plan trips to reduce unnecessary fuel consumption.');
            break;
          default:
            potentialReduction += currentSpending * 0.1;
            tips.push(`Review your ${pattern.category} expenses for potential optimizations.`);
        }

        return {
          category: pattern.category,
          currentSpending,
          suggestedBudget: currentSpending - potentialReduction,
          potentialSavings: potentialReduction,
          confidence: Math.min(confidence, 95),
          tips
        };
      });
  };

  const formatAmount = (amount: number) => {
    const displayAmount = currentCurrency === 'INR' ? amount * conversionRate : amount;
    return `${currentCurrency === 'USD' ? '$' : '₹'} ${displayAmount.toFixed(2)}`;
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          AI Savings Analyzer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get personalized savings recommendations based on your spending patterns
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!insights.length && !isAnalyzing && (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Analyze your expense data to discover saving opportunities
            </p>
            <Button onClick={analyzeExpenses} className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Analyze My Expenses
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing your spending patterns...</p>
          </div>
        )}

        {insights.length > 0 && (
          <>
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Total Potential Monthly Savings</h3>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatAmount(totalPotentialSavings)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on AI analysis of your spending patterns
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Savings Recommendations</h3>
              {insights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{insight.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {formatAmount(insight.currentSpending)}/month
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Potential Savings</span>
                      <span className="font-medium text-green-600">
                        {formatAmount(insight.potentialSavings)}
                      </span>
                    </div>
                    <Progress 
                      value={(insight.potentialSavings / insight.currentSpending) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">TIPS:</p>
                    {insight.tips.map((tip, tipIndex) => (
                      <p key={tipIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-primary">•</span>
                        {tip}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={analyzeExpenses} 
              variant="outline" 
              className="w-full gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Re-analyze Data
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsAnalyzer;
