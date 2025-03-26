
// Categories with icons and colors
export const expenseCategories = [
  { id: 'food', name: 'Food & Dining', color: 'bg-orange-100 text-orange-700' },
  { id: 'transportation', name: 'Transportation', color: 'bg-blue-100 text-blue-700' },
  { id: 'entertainment', name: 'Entertainment', color: 'bg-purple-100 text-purple-700' },
  { id: 'shopping', name: 'Shopping', color: 'bg-pink-100 text-pink-700' },
  { id: 'utilities', name: 'Utilities', color: 'bg-teal-100 text-teal-700' },
  { id: 'health', name: 'Health', color: 'bg-green-100 text-green-700' },
  { id: 'education', name: 'Education', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-700' },
];

// Currency options
export const currencyOptions = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

// Default currency
const DEFAULT_CURRENCY = 'INR';

// Storage keys
const EXPENSE_STORAGE_KEY = 'expense-tracker-data';
const CURRENCY_STORAGE_KEY = 'expense-tracker-currency';
const THEME_STORAGE_KEY = 'expense-tracker-theme';

// Get or set currency
export const getCurrency = () => {
  const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
  return storedCurrency || DEFAULT_CURRENCY;
};

export const setCurrency = (currencyCode) => {
  localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  return currencyCode;
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const currency = currencyOptions.find(c => c.code === currencyCode);
  return currency ? currency.symbol : '₹';
};

// Get or set theme
export const getTheme = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  return theme;
};

// Save expenses to localStorage
export const saveExpenses = (expenses) => {
  localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses));
};

// Get expenses from localStorage
export const getExpenses = () => {
  const storedExpenses = localStorage.getItem(EXPENSE_STORAGE_KEY);
  return storedExpenses ? JSON.parse(storedExpenses) : [];
};

// Add a new expense
export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: Date.now().toString(),
    date: expense.date || new Date().toISOString(),
  };
  const updatedExpenses = [newExpense, ...expenses];
  saveExpenses(updatedExpenses);
  return newExpense;
};

// Delete an expense - Fixed the delete functionality
export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter(expense => expense.id !== id);
  saveExpenses(updatedExpenses);
  return updatedExpenses;
};

// Update an expense
export const updateExpense = (updatedExpense) => {
  const expenses = getExpenses();
  const updatedExpenses = expenses.map(expense => 
    expense.id === updatedExpense.id ? updatedExpense : expense
  );
  saveExpenses(updatedExpenses);
  return updatedExpenses;
};

// Format amount as currency
export const formatCurrency = (amount, currencyCode = getCurrency()) => {
  const symbol = getCurrencySymbol(currencyCode);
  
  // Use Indian number formatting for INR
  if (currencyCode === 'INR') {
    const numStr = Math.abs(amount).toFixed(2);
    const parts = numStr.split('.');
    const lastThree = parts[0].length > 3 ? parts[0].substring(parts[0].length - 3) : parts[0];
    const otherNumbers = parts[0].length > 3 ? parts[0].substring(0, parts[0].length - 3) : '';
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherNumbers ? ',' : '') + lastThree;
    return `${symbol}${formatted}.${parts[1]}`;
  }
  
  // Use standard formatting for other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get expenses for a specific time period
export const getExpensesByPeriod = (period) => {
  const expenses = getExpenses();
  const now = new Date();
  
  switch (period) {
    case 'day': {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getDate() === now.getDate() &&
               expenseDate.getMonth() === now.getMonth() &&
               expenseDate.getFullYear() === now.getFullYear();
      });
    }
    case 'week': {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return expenses.filter(expense => new Date(expense.date) >= oneWeekAgo);
    }
    case 'month': {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenses.filter(expense => new Date(expense.date) >= firstDayOfMonth);
    }
    default:
      return expenses;
  }
};

// Calculate total amount
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
};

// Group expenses by category
export const groupByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        expenses: []
      };
    }
    acc[category].total += parseFloat(expense.amount);
    acc[category].expenses.push(expense);
    return acc;
  }, {});
};

// Get data for pie chart
export const getPieChartData = (expenses) => {
  const groupedExpenses = groupByCategory(expenses);
  
  return Object.keys(groupedExpenses).map(category => {
    const categoryInfo = expenseCategories.find(c => c.id === category) || 
                        { name: 'Unknown', color: 'bg-gray-100' };
    
    return {
      name: categoryInfo.name,
      value: groupedExpenses[category].total,
    };
  });
};

// Get data for line chart (spending over time) - Added fullDate for more detailed information
export const getLineChartData = (expenses, days = 7) => {
  const data = [];
  const now = new Date();
  
  // Create array of last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayStr = date.toISOString().split('T')[0];
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getDate() === date.getDate() &&
             expenseDate.getMonth() === date.getMonth() &&
             expenseDate.getFullYear() === date.getFullYear();
    });
    
    const total = calculateTotal(dayExpenses);
    
    // Format full date for display in tooltip
    const fullDate = new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    }).format(date);
    
    data.push({
      date: dayStr,
      label: `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)} ${date.getDate()}`,
      fullDate: fullDate,
      amount: total
    });
  }
  
  return data;
};

// Export expenses to CSV
export const exportToCSV = (expenses) => {
  if (expenses.length === 0) return null;
  
  // Get currency for formatting
  const currencyCode = getCurrency();
  const symbol = getCurrencySymbol(currencyCode);
  
  // Define CSV headers
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  expenses.forEach(expense => {
    const category = expenseCategories.find(c => c.id === expense.category)?.name || expense.category;
    const date = formatDate(expense.date);
    const amount = formatCurrency(expense.amount, currencyCode).replace(symbol, ''); // Remove currency symbol
    const description = expense.description ? `"${expense.description.replace(/"/g, '""')}"` : ''; // Escape quotes in description
    
    csvContent += `${date},${category},${amount},${description}\n`;
  });
  
  return csvContent;
};

// Download CSV file
export const downloadCSV = (expenses, filename = 'expense-data.csv') => {
  const csvContent = exportToCSV(expenses);
  if (!csvContent) return false;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
