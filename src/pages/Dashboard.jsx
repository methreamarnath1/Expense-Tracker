import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, getExpensesByPeriod, deleteExpense } from '../utils/expenseUtils';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load expenses from localStorage on component mount
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    let filteredExpenses;
    
    switch (activeTab) {
      case 'today':
        filteredExpenses = getExpensesByPeriod('day');
        break;
      case 'week':
        filteredExpenses = getExpensesByPeriod('week');
        break;
      case 'month':
        filteredExpenses = getExpensesByPeriod('month');
        break;
      default:
        filteredExpenses = getExpenses();
    }
    
    setExpenses(filteredExpenses);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowQuickAdd(true);
  };

  const handleDeleteExpense = (id) => {
    deleteExpense(id);
    loadExpenses();
    toast.success("Expense deleted successfully");
  };

  const handleSaveExpense = () => {
    setShowQuickAdd(false);
    setEditingExpense(null);
    loadExpenses();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    loadExpenses();
  }, [activeTab]);

  return (
    <div className="w-full mx-auto pb-6 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your expenses</p>
        </div>
        
        <button
          onClick={() => setShowQuickAdd(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors btn-scale"
        >
          <Plus className="mr-2 h-4 w-4 icon" />
          Add Expense
        </button>
      </div>

      {/* Summary cards */}
      <ExpenseSummary />

      {/* Quick add expense dialog */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md relative">
            <button
              onClick={() => {
                setShowQuickAdd(false);
                setEditingExpense(null);
              }}
              className="absolute -top-10 right-0 p-2 text-white hover:text-accent transition-colors"
            >
              <X className="h-5 w-5 icon" />
            </button>
            <ExpenseForm
              editExpense={editingExpense}
              onSave={handleSaveExpense}
            />
          </div>
        </div>
      )}

      {/* Main content section */}
      <div className="mt-8 md:mt-10">
        <div className="mb-6">
          <div className="border-b border-border overflow-x-auto">
            <div className="flex -mb-px space-x-4 md:space-x-6">
              <TabButton
                active={activeTab === 'all'}
                onClick={() => handleTabChange('all')}
                text="All Expenses"
              />
              <TabButton
                active={activeTab === 'today'}
                onClick={() => handleTabChange('today')}
                text="Today"
              />
              <TabButton
                active={activeTab === 'week'}
                onClick={() => handleTabChange('week')}
                text="This Week"
              />
              <TabButton
                active={activeTab === 'month'}
                onClick={() => handleTabChange('month')}
                text="This Month"
              />
            </div>
          </div>
        </div>

        {/* Expenses list */}
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, text }) => (
  <button
    onClick={onClick}
    className={`px-3 md:px-4 py-2 inline-block text-sm font-medium border-b-2 ${
      active
        ? 'border-accent text-accent'
        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
    } transition-colors whitespace-nowrap`}
  >
    {text}
  </button>
);

export default Dashboard;
