import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AddProduct from './components/AddProduct';
import Reports from './components/Reports';
import Shop from './components/Shop';
import './index.css';

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Date.now(),
      ...newProduct,
      stock: Number(newProduct.stock),
      cost: Number(newProduct.cost),
      price: Number(newProduct.price),
      sold: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, product]);
  };

  const handleUpdateProduct = (id, updates) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleRecordSale = (id, quantity) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const availableStock = product.stock - product.sold;
    if (quantity > availableStock) {
      alert(`Not enough stock. Available: ${availableStock}`);
      return;
    }

    setProducts(products.map(p =>
      p.id === id ? { ...p, sold: p.sold + quantity } : p
    ));
  };

  const metrics = {
    totalSales: products.reduce((sum, p) => sum + (p.sold * p.price), 0),
    totalCost: products.reduce((sum, p) => sum + (p.sold * p.cost), 0),
    totalProfit: products.reduce((sum, p) => sum + ((p.price - p.cost) * p.sold), 0),
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <h1>📦 Inventory Management System</h1>
          <p className="subtitle">Professional Inventory & Sales Tracking</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-button ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🛍️ Shop
        </button>
        <button
          className={`nav-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`nav-button ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          Add Product
        </button>
        <button
          className={`nav-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard metrics={metrics} products={products} />
        )}
        {activeTab === 'shop' && (
          <Shop products={products} />
        )}
        {activeTab === 'inventory' && (
          <Inventory
            products={products}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            onRecordSale={handleRecordSale}
          />
        )}
        {activeTab === 'add-product' && (
          <AddProduct onAddProduct={handleAddProduct} />
        )}
        {activeTab === 'reports' && (
          <Reports products={products} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Inventory Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
