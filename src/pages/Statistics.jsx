
import React, { useState } from 'react';
import ExpenseChart from '../components/ExpenseChart';
import { getExpensesByPeriod, calculateTotal, formatCurrency } from '../utils/expenseUtils';

const Statistics = () => {
  const [activePeriod, setActivePeriod] = useState('month');
  
  const periodExpenses = getExpensesByPeriod(activePeriod);
  const totalAmount = calculateTotal(periodExpenses);
  
  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
  ];

  return (
    <div className="w-full mx-auto pb-6 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1">Statistics</h1>
        <p className="text-muted-foreground">Visualize your spending patterns</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-medium">
            Total {activePeriod === 'week' ? 'Weekly' : 'Monthly'} Spending
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-accent">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="inline-flex p-1 rounded-lg bg-muted">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setActivePeriod(period.id)}
              className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activePeriod === period.id
                  ? 'bg-card shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Charts */}
      <ExpenseChart period={activePeriod} />
      
      {/* Statistics summary */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard 
          title="Number of Expenses" 
          value={periodExpenses.length}
          format="count" 
        />
        
        <StatCard 
          title="Average Expense" 
          value={periodExpenses.length > 0 ? totalAmount / periodExpenses.length : 0}
          format="currency" 
        />
        
        <StatCard 
          title="Highest Expense" 
          value={periodExpenses.length > 0 ? Math.max(...periodExpenses.map(e => parseFloat(e.amount))) : 0}
          format="currency" 
        />
        
        <StatCard 
          title="Most Common Category" 
          value={getMostCommonCategory(periodExpenses)}
          format="text" 
        />
      </div>
    </div>
  );
};

// Helper function to get most common category
const getMostCommonCategory = (expenses) => {
  if (expenses.length === 0) return 'None';
  
  const categoryCount = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommon = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0];
  
  return mostCommon ? mostCommon[0].charAt(0).toUpperCase() + mostCommon[0].slice(1) : 'None';
};

const StatCard = ({ title, value, format }) => {
  let formattedValue;
  
  switch (format) {
    case 'currency':
      formattedValue = formatCurrency(value);
      break;
    case 'count':
      formattedValue = value;
      break;
    case 'text':
    default:
      formattedValue = value;
  }
  
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xl md:text-2xl font-semibold mt-1">{formattedValue}</p>
    </div>
  );
};

export default Statistics;
