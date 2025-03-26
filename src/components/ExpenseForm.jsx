
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  expenseCategories, 
  addExpense, 
  updateExpense, 
  getCurrency,
  getCurrencySymbol
} from '../utils/expenseUtils';
import { PlusCircle, Save, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ExpenseForm = ({ editExpense = null, onSave = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().substr(0, 10)
  });
  const [errors, setErrors] = useState({});
  const currencySymbol = getCurrencySymbol(getCurrency());

  // Set form data when editing an expense
  useEffect(() => {
    if (editExpense) {
      setFormData({
        ...editExpense,
        date: new Date(editExpense.date).toISOString().substr(0, 10)
      });
    }
  }, [editExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editExpense) {
        // Update existing expense
        updateExpense({
          ...formData,
          id: editExpense.id,
          amount: parseFloat(formData.amount)
        });
        toast({
          title: 'Expense updated',
          description: 'Your expense has been successfully updated.',
        });
      } else {
        // Add new expense
        addExpense({
          ...formData,
          amount: parseFloat(formData.amount)
        });
        toast({
          title: 'Expense added',
          description: 'Your expense has been successfully added.',
        });
      }
      
      // Reset form or navigate back
      if (onSave) {
        onSave();
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving your expense. Please try again.',
        variant: 'destructive'
      });
      console.error('Error saving expense:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-xl p-6 animate-scale-in">
      <h2 className="text-2xl font-medium mb-6 text-center">
        {editExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1 text-foreground">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {currencySymbol}
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full pl-8 pr-3 py-2 rounded-lg border ${
                errors.amount ? 'border-destructive' : 'border-input'
              } bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent input-highlight`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-destructive">{errors.amount}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1 text-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.category ? 'border-destructive' : 'border-input'
            } bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent input-highlight`}
          >
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-destructive">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-foreground">
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Lunch at restaurant"
            className="w-full px-3 py-2 rounded-lg border border-input bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent input-highlight"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1 text-foreground">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.date ? 'border-destructive' : 'border-input'
            } bg-card/50 focus:outline-none focus:ring-2 focus:ring-accent input-highlight`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-destructive">{errors.date}</p>
          )}
        </div>
        
        <div className="pt-2 flex space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-input rounded-lg text-foreground hover:bg-muted transition-colors btn-scale"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors btn-scale"
          >
            {editExpense ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
