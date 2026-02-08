import React from 'react';

function Dashboard({ metrics, products }) {
  const profitMargin = metrics.totalSales > 0
    ? ((metrics.totalProfit / metrics.totalSales) * 100).toFixed(2)
    : 0;

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card sales-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Sales</h3>
            <p className="card-value">Rs {metrics.totalSales.toLocaleString()}</p>
            <span className="card-detail">{metrics.totalSold} items sold</span>
          </div>
        </div>

        <div className="dashboard-card cost-card">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Cost</h3>
            <p className="card-value">Rs {metrics.totalCost.toLocaleString()}</p>
            <span className="card-detail">Of sold items</span>
          </div>
        </div>

        <div className={`dashboard-card ${metrics.totalProfit >= 0 ? 'profit-card' : 'loss-card'}`}>
          <div className="card-icon">{metrics.totalProfit >= 0 ? '📈' : '📉'}</div>
          <div className="card-content">
            <h3>Profit / Loss</h3>
            <p className="card-value">Rs {metrics.totalProfit.toLocaleString()}</p>
            <span className="card-detail">Margin: {profitMargin}%</span>
          </div>
        </div>

        <div className="dashboard-card products-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Total Products</h3>
            <p className="card-value">{metrics.totalProducts}</p>
            <span className="card-detail">In inventory</span>
          </div>
        </div>

        <div className="dashboard-card stock-card">
          <div className="card-icon">🏭</div>
          <div className="card-content">
            <h3>Total Stock</h3>
            <p className="card-value">{metrics.totalStock}</p>
            <span className="card-detail">Units available</span>
          </div>
        </div>

        <div className="dashboard-card sold-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Items Sold</h3>
            <p className="card-value">{metrics.totalSold}</p>
            <span className="card-detail">Total quantity</span>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="dashboard-section">
          <h3>Top Performing Products</h3>
          <div className="table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.sold > 0)
                  .sort((a, b) => (b.sold * b.price) - (a.sold * a.price))
                  .slice(0, 5)
                  .map(p => (
                    <tr key={p.id}>
                      <td className="product-name">{p.name}</td>
                      <td>{p.sold}</td>
                      <td>Rs {(p.sold * p.price).toLocaleString()}</td>
                      <td className="profit">
                        Rs {((p.price - p.cost) * p.sold).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="empty-state">
          <p>No products yet. Add your first product to get started! 🚀</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
