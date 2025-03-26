
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getExpensesByPeriod, getPieChartData, getLineChartData, formatCurrency } from '../utils/expenseUtils';
import { format } from 'date-fns';

const ExpenseChart = ({ period = 'month' }) => {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  
  useEffect(() => {
    const expenses = getExpensesByPeriod(period);
    setPieData(getPieChartData(expenses));
    setLineData(getLineChartData(expenses, period === 'month' ? 30 : 7));
  }, [period]);

  // Enhanced colors for pie chart
  const IMPROVED_COLORS = [
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#FFD166', // yellow
    '#6A0572', // purple
    '#1A936F', // green
    '#3D5A80', // navy
    '#E76F51', // orange
    '#9A8C98', // mauve
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg border border-border shadow-lg">
          <p className="text-sm font-medium">{payload[0].name || payload[0].payload.name}</p>
          <p className="text-sm text-accent">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg border border-border shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload[0].payload.fullDate && (
            <p className="text-xs text-muted-foreground">{payload[0].payload.fullDate}</p>
          )}
          <p className="text-sm text-accent mt-1">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label formatter for X axis
  const formatXAxis = (value) => {
    return value.split(' ')[0]; // Just show the day name for space conservation
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Category breakdown */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
        {pieData.length > 0 ? (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={IMPROVED_COLORS[index % IMPROVED_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
      
      {/* Daily spending */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-medium mb-4">
          {period === 'week' ? 'Daily Spending (Last 7 Days)' : 'Daily Spending (Last 30 Days)'}
        </h3>
        {lineData.length > 0 && lineData.some(item => item.amount > 0) ? (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <XAxis 
                  dataKey="label" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
