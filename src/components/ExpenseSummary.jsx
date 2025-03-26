
import React from 'react';
import { 
  formatCurrency, 
  calculateTotal, 
  getExpensesByPeriod 
} from '../utils/expenseUtils';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const ExpenseSummary = () => {
  // Get expenses for different time periods
  const todayExpenses = getExpensesByPeriod('day');
  const weekExpenses = getExpensesByPeriod('week');
  const monthExpenses = getExpensesByPeriod('month');
  
  // Calculate totals
  const todayTotal = calculateTotal(todayExpenses);
  const weekTotal = calculateTotal(weekExpenses);
  const monthTotal = calculateTotal(monthExpenses);
  
  // Calculate average daily spending for this week
  const avgDailySpending = weekExpenses.length > 0 ? weekTotal / 7 : 0;
  
  // Determine if spending trend is up or down
  const previousWeekTotal = 0; // In a real app, you'd calculate this from historical data
  const trendIsUp = weekTotal > previousWeekTotal;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard 
        title="Today" 
        amount={todayTotal} 
        icon={<Calendar className="h-5 w-5 icon" />}
        description={`${todayExpenses.length} expense${todayExpenses.length !== 1 ? 's' : ''}`}
        color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
        iconBg="bg-blue-100 dark:bg-blue-900"
      />
      
      <SummaryCard 
        title="This Week" 
        amount={weekTotal} 
        icon={<DollarSign className="h-5 w-5 icon" />}
        description={`${weekExpenses.length} expense${weekExpenses.length !== 1 ? 's' : ''}`}
        color="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"
        iconBg="bg-purple-100 dark:bg-purple-900"
      />
      
      <SummaryCard 
        title="This Month" 
        amount={monthTotal} 
        icon={<DollarSign className="h-5 w-5 icon" />}
        description={`${monthExpenses.length} expense${monthExpenses.length !== 1 ? 's' : ''}`}
        color="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300"
        iconBg="bg-teal-100 dark:bg-teal-900"
      />
      
      <SummaryCard 
        title="Daily Average" 
        amount={avgDailySpending} 
        icon={trendIsUp ? <TrendingUp className="h-5 w-5 icon" /> : <TrendingDown className="h-5 w-5 icon" />}
        description={trendIsUp ? "Higher than last week" : "Lower than last week"}
        color={trendIsUp ? "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300" : "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300"}
        iconBg={trendIsUp ? "bg-pink-100 dark:bg-pink-900" : "bg-green-100 dark:bg-green-900"}
      />
    </div>
  );
};

const SummaryCard = ({ title, amount, icon, description, color, iconBg }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md animate-scale-in">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-xl md:text-2xl font-semibold mt-1">{formatCurrency(amount)}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className={`rounded-full p-2 ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-1 ${color.split(' ')[0]}`}></div>
    </div>
  );
};

export default ExpenseSummary;
