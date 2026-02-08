import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function Reports({ products }) {
  const [reportType, setReportType] = useState('daily');

  const getDailyReport = () => {
    const today = new Date().toISOString().split('T')[0];
    return products.filter(p => {
      const createdDate = p.createdAt?.split('T')[0];
      return createdDate === today || p.sold > 0;
    });
  };

  const getMonthlyReport = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return products.filter(p => {
      const createdMonth = p.createdAt?.slice(0, 7);
      return createdMonth === currentMonth || p.sold > 0;
    });
  };

  const generateReport = () => {
    if (reportType === 'daily') {
      return getDailyReport();
    } else if (reportType === 'monthly') {
      return getMonthlyReport();
    } else {
      return products;
    }
  };

  const reportData = generateReport();
  const totalSales = reportData.reduce((sum, p) => sum + (p.sold * p.price), 0);
  const totalCost = reportData.reduce((sum, p) => sum + (p.sold * p.cost), 0);
  const totalProfit = totalSales - totalCost;
  const totalItems = reportData.reduce((sum, p) => sum + p.sold, 0);

  // Prepare data for Bar Chart - Sales by Product
  const barChartData = reportData
    .filter(p => p.sold > 0)
    .sort((a, b) => (b.sold * b.price) - (a.sold * a.price))
    .slice(0, 8)
    .map(p => ({
      name: p.name,
      Revenue: p.sold * p.price,
      Cost: p.sold * p.cost,
      Profit: (p.price - p.cost) * p.sold,
    }));

  // Prepare data for Pie Chart - Product Contribution
  const pieChartData = reportData
    .filter(p => p.sold > 0)
    .map(p => ({
      name: p.name,
      value: Math.round((p.sold * p.price / totalSales) * 100),
      revenue: p.sold * p.price,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Prepare data for Line Chart - Sales Trend
  const lineTrendData = reportData
    .filter(p => p.sold > 0)
    .sort((a, b) => (b.sold * b.price) - (a.sold * a.price))
    .slice(0, 6)
    .map((p, idx) => ({
      name: p.name,
      Revenue: p.sold * p.price,
      Profit: (p.price - p.cost) * p.sold,
    }));

  // Colors for charts
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

  const handleExportCSV = () => {
    const headers = ['Product Name', 'Stock', 'Cost Price', 'Selling Price', 'Sold', 'Revenue', 'Profit'];
    const rows = reportData.map(p => [
      p.name,
      p.stock,
      p.cost,
      p.price,
      p.sold,
      p.sold * p.price,
      (p.price - p.cost) * p.sold,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      `Report Type,${reportType}`,
      `Total Sales,${totalSales}`,
      `Total Cost,${totalCost}`,
      `Total Profit,${totalProfit}`,
      `Items Sold,${totalItems}`,
      `Generated,${new Date().toLocaleString()}`,
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports">
      <h2>Sales Reports</h2>

      <div className="report-controls">
        <div className="report-type-selector">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-input"
          >
            <option value="daily">Daily Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="all">All Time Report</option>
          </select>
        </div>

        <div className="report-actions">
          <button className="btn-primary" onClick={handleExportCSV}>
            📥 Export as CSV
          </button>
          <button className="btn-secondary" onClick={handlePrint}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p className="summary-value">Rs {totalSales.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Total Cost</h4>
          <p className="summary-value">Rs {totalCost.toLocaleString()}</p>
        </div>
        <div className={`summary-card ${totalProfit >= 0 ? 'profit' : 'loss'}`}>
          <h4>Net Profit</h4>
          <p className="summary-value">Rs {totalProfit.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Items Sold</h4>
          <p className="summary-value">{totalItems}</p>
        </div>
      </div>

      {/* Charts Section */}
      {reportData.length > 0 && (
        <div className="charts-section">
          {/* Bar Chart - Revenue, Cost, Profit */}
          <div className="chart-container">
            <h3>📊 Sales Performance by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `Rs ${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '4px', color: 'white' }}
                />
                <Legend />
                <Bar dataKey="Revenue" fill="#667eea" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Cost" fill="#f56565" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Profit" fill="#48bb78" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Product Contribution to Revenue */}
          <div className="chart-container">
            <h3>🥧 Product Contribution to Revenue</h3>
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => `Rs ${props.payload.revenue.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '4px', color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart - Revenue vs Profit Trend */}
          <div className="chart-container full-width">
            <h3>📈 Revenue & Profit Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `Rs ${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '4px', color: 'white' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Profit" 
                  stroke="#48bb78" 
                  strokeWidth={3}
                  dot={{ fill: '#48bb78', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics Summary */}
          <div className="metrics-grid">
            <div className="metric-box">
              <h4>Profit Margin</h4>
              <p className="metric-value">{totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="metric-box">
              <h4>Average Sale Value</h4>
              <p className="metric-value">Rs {totalItems > 0 ? (totalSales / totalItems).toLocaleString() : 0}</p>
            </div>
            <div className="metric-box">
              <h4>Cost Ratio</h4>
              <p className="metric-value">{totalSales > 0 ? ((totalCost / totalSales) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="metric-box">
              <h4>Top Product</h4>
              <p className="metric-value">{reportData.length > 0 ? reportData.reduce((a, b) => (b.sold * b.price) > (a.sold * a.price) ? b : a).name : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {reportData.length > 0 ? (
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Sold</th>
                <th>Revenue</th>
                <th>Cost of Sales</th>
                <th>Profit per Unit</th>
                <th>Total Profit</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((product) => {
                const revenue = product.sold * product.price;
                const costOfSales = product.sold * product.cost;
                const profitPerUnit = product.price - product.cost;
                const totalProfit = profitPerUnit * product.sold;

                return (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.stock}</td>
                    <td>Rs {product.cost.toLocaleString()}</td>
                    <td>Rs {product.price.toLocaleString()}</td>
                    <td>{product.sold}</td>
                    <td className="revenue">Rs {revenue.toLocaleString()}</td>
                    <td>Rs {costOfSales.toLocaleString()}</td>
                    <td>Rs {profitPerUnit.toLocaleString()}</td>
                    <td className={`total-profit ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
                      Rs {totalProfit.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5"><strong>TOTAL</strong></td>
                <td colSpan="1"><strong>Rs {totalSales.toLocaleString()}</strong></td>
                <td colSpan="1"><strong>Rs {totalCost.toLocaleString()}</strong></td>
                <td colSpan="2"><strong className={totalProfit >= 0 ? 'positive' : 'negative'}>Rs {totalProfit.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No data available for the selected report period.</p>
        </div>
      )}

      <div className="info-section">
        <h3>ℹ️ Data Storage</h3>
        <p>All data is stored locally in your browser. Export CSV regularly for backup.</p>
      </div>
    </div>
  );
}

export default Reports;
