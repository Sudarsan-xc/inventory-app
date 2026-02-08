# 📦 Inventory Management System

A professional, production-grade inventory management website built with **React 19**, **Vite**, and **Vanilla JavaScript**.

## ✨ Features

- **Dashboard**: Real-time metrics (Sales, Cost, Profit, Stock)
- **Inventory Table**: Manage products with edit/delete functionality
- **Add Products**: Form with validation and profit calculations
- **Record Sales**: Track sales with automatic stock reduction
- **Reports**: Daily/Monthly/All-time reports with CSV export
- **Print Support**: Generate and print professional reports
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Data Persistence**: localStorage ensures data survives browser restart

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd inventory-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

```
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
inventory-app/
├── src/
│   ├── App.jsx                    ← Main app
│   ├── main.jsx                   ← Entry point
│   ├── index.css                  ← All styling
│   └── components/
│       ├── Dashboard.jsx          ← Metrics
│       ├── Inventory.jsx          ← Table
│       ├── AddProduct.jsx         ← Form
│       └── Reports.jsx            ← Reports
├── package.json
├── vite.config.js
└── index.html
```

## 🎯 How to Use

### Add Products

1. Click "Add Product" tab
2. Fill in product details
3. Review profit margin
4. Click "Add Product"

### Record Sales

1. Go to "Inventory" tab
2. Enter quantity in sales section
3. Click "Record Sale"
4. Stock updates automatically

### View Reports

1. Click "Reports" tab
2. Select report type
3. Export CSV or Print

## 💾 Data Storage

- All data stored in browser localStorage
- No internet needed
- Export CSV for backup

## 📋 Dependencies

- React 19.2.0
- React DOM 19.2.0
- Vite 7.2.4
- @vitejs/plugin-react 5.1.1

---

**Version:** 1.0.0 | **Built with:** React + Vite
