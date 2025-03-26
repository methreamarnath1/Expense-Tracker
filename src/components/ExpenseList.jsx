
import React, { useState } from 'react';
import { 
  formatCurrency, 
  formatDate, 
  expenseCategories, 
  deleteExpense 
} from '../utils/expenseUtils';
import { Edit, Trash2, Search, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ExpenseList = ({ expenses, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const handleDelete = (id) => {
    try {
      deleteExpense(id);
      toast({
        title: 'Expense deleted',
        description: 'Your expense has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error deleting the expense.',
        variant: 'destructive'
      });
    }
  };

  const getCategoryInfo = (categoryId) => {
    return expenseCategories.find(c => c.id === categoryId) || 
           { name: 'Other', color: 'bg-gray-100 text-gray-700' };
  };

  // Filter and search expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryInfo(expense.category).name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
  };

  return (
    <div className="w-full">
      {/* Search and filter */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search expenses..."
            className="pl-10 pr-3 py-2 w-full rounded-lg border border-input bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Categories</option>
          {expenseCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {(searchTerm || filterCategory) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm border border-input rounded-lg hover:bg-muted transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Expenses list */}
      {filteredExpenses.length > 0 ? (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const category = getCategoryInfo(expense.category);
            
            return (
              <div 
                key={expense.id} 
                className="p-4 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center">
                      <span className={`text-lg font-medium ${parseFloat(expense.amount) >= 100 ? 'text-destructive' : ''}`}>
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                        {category.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </span>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(expense)}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors"
                        aria-label="Edit expense"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {expense.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {expense.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg animate-fade-in">
          {expenses.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-2">No expenses added yet.</p>
              <p className="text-sm text-muted-foreground">Add your first expense to get started!</p>
            </>
          ) : (
            <p className="text-muted-foreground">No expenses match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
