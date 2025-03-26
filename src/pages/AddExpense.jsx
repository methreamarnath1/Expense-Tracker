
import React from 'react';
import ExpenseForm from '../components/ExpenseForm';

const AddExpense = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1">Add Expense</h1>
        <p className="text-muted-foreground">Create a new expense entry</p>
      </div>
      
      <ExpenseForm />
    </div>
  );
};

export default AddExpense;
