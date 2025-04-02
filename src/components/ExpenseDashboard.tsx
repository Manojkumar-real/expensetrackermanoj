
import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, ResponsiveContainer, Bar, Cell, Pie, Tooltip, Legend, XAxis, YAxis } from 'recharts';

const ExpenseDashboard: React.FC = () => {
  const { expenses, summary } = useExpenses();
  
  const categoryColors = [
    "#0ea5e9", "#2dd4bf", "#a3e635", "#facc15", 
    "#fb923c", "#f87171", "#e879f9", "#c084fc", 
    "#818cf8", "#60a5fa", "#38bdf8", "#34d399"
  ];
  
  const getCategoryColor = (index: number) => {
    return categoryColors[index % categoryColors.length];
  };

  const categoryData = Object.entries(summary.byCategory).map(([name, value], index) => ({
    name,
    value,
    color: getCategoryColor(index)
  })).sort((a, b) => b.value - a.value);

  const monthlyData = Object.entries(summary.byMonth).map(([month, amount]) => {
    const date = new Date(month);
    return {
      name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      amount,
      month
    };
  }).sort((a, b) => a.month.localeCompare(b.month));
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="w-full animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="chart-container">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: 'none' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="text-xl">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent className="chart-container">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}`} 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="amount" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full md:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="text-xl">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-accent rounded-lg p-4 text-center">
              <div className="text-muted-foreground text-sm font-medium">Total Expenses</div>
              <div className="text-3xl font-bold mt-1">${summary.total.toFixed(2)}</div>
            </div>
            
            <div className="bg-accent rounded-lg p-4 text-center">
              <div className="text-muted-foreground text-sm font-medium">Average Expense</div>
              <div className="text-3xl font-bold mt-1">
                ${expenses.length > 0 ? (summary.total / expenses.length).toFixed(2) : '0.00'}
              </div>
            </div>
            
            <div className="bg-accent rounded-lg p-4 text-center">
              <div className="text-muted-foreground text-sm font-medium">Total Records</div>
              <div className="text-3xl font-bold mt-1">{expenses.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseDashboard;
