
import React, { useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';
import { 
  getExpenses, 
  saveExpenses, 
  currencyOptions, 
  getCurrency,
  setCurrency,
  getTheme,
  setTheme,
  downloadCSV
} from '../utils/expenseUtils';
import { 
  Save, 
  Trash2, 
  AlertTriangle, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  FileDown 
} from 'lucide-react';
import { IndianRupee } from 'lucide-react';

const Settings = () => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(getCurrency());
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  
  useEffect(() => {
    // Update document with theme class
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, [currentTheme]);
  
  const handleExportData = () => {
    try {
      const expenses = getExpenses();
      const dataStr = JSON.stringify(expenses, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Data exported successfully',
        description: 'Your expense data has been downloaded as JSON.',
      });
    } catch (error) {
      toast({
        title: 'Error exporting data',
        description: 'There was an error exporting your data.',
        variant: 'destructive'
      });
    }
  };
  
  const handleExportCSV = () => {
    try {
      const expenses = getExpenses();
      if (expenses.length === 0) {
        toast({
          title: 'No data to export',
          description: 'Add some expenses before exporting to CSV.',
          variant: 'destructive'
        });
        return;
      }
      
      const success = downloadCSV(expenses);
      
      if (success) {
        toast({
          title: 'CSV exported successfully',
          description: 'Your expense data has been downloaded as CSV.',
        });
      } else {
        throw new Error('Failed to generate CSV');
      }
    } catch (error) {
      toast({
        title: 'Error exporting CSV',
        description: 'There was an error exporting your data to CSV.',
        variant: 'destructive'
      });
    }
  };
  
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          saveExpenses(data);
          toast({
            title: 'Data imported successfully',
            description: `Imported ${data.length} expense records.`,
          });
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        toast({
          title: 'Error importing data',
          description: 'The selected file contains invalid data.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = null;
  };
  
  const handleClearData = () => {
    try {
      saveExpenses([]);
      setShowConfirmDelete(false);
      toast({
        title: 'Data cleared',
        description: 'All your expense data has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error clearing data',
        description: 'There was an error clearing your data.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency);
    toast({
      title: 'Currency updated',
      description: `Your currency is now set to ${currencyOptions.find(c => c.code === newCurrency)?.name}.`,
    });
  };
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    setTheme(newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `The application theme has been switched to ${newTheme} mode.`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your expense data</p>
      </div>
      
      {/* Theme & Currency Section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium">Display Settings</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Customize how your data is displayed
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Switch between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-lg border border-input hover:bg-muted transition-colors btn-scale"
            >
              {currentTheme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
          
          {/* Currency Selector */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Currency</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select your preferred currency
              </p>
            </div>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="px-3 py-2 rounded-lg border border-input bg-card hover:bg-muted transition-colors"
            >
              {currencyOptions.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Data Management Section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium">Data Management</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Export, import, or clear your expense data
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* JSON Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Export Data (JSON)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download all your expense data as a JSON file
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors btn-scale"
            >
              <Save className="mr-2 h-4 w-4" />
              Export JSON
            </button>
          </div>
          
          {/* CSV Export */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Export as CSV</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download your expense data as a CSV spreadsheet
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors btn-scale"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </button>
          </div>
          
          {/* Import */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Import Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Import expense data from a JSON file
              </p>
            </div>
            <div>
              <label
                htmlFor="import-file"
                className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 border border-input bg-card rounded-lg hover:bg-muted transition-colors cursor-pointer btn-scale"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </label>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Clear Data */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Clear Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Delete all your expense data (this action cannot be undone)
              </p>
            </div>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors btn-scale"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-medium">About</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Expense Tracker App
        </p>
        <p className="text-muted-foreground text-sm mt-4">
          This application stores all data locally on your device using browser storage.
          No data is sent to any server.
        </p>
      </div>
      
      {/* Confirmation dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-3 text-destructive mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Confirm Data Deletion</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete all your expense data? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
