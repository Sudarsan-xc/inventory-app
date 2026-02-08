import React, { useState } from 'react';

function Inventory({ products, onUpdate, onDelete, onRecordSale }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saleData, setSaleData] = useState({});

  const handleEditStart = (product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      cost: product.cost,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleEditSave = (id) => {
    onUpdate(id, {
      name: editData.name || '',
      cost: Number(editData.cost) || 0,
      price: Number(editData.price) || 0,
      stock: Number(editData.stock) || 0,
    });
    setEditingId(null);
  };

  const handleSaleSubmit = (id) => {
    const quantity = Number(saleData[id]) || 0;
    if (quantity > 0) {
      onRecordSale(id, quantity);
      setSaleData({ ...saleData, [id]: '' });
    }
  };

  if (products.length === 0) {
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        <div className="empty-state">
          <p>No products in inventory. Add a product to get started! 📦</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory">
      <h2>Inventory Management</h2>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Sold</th>
              <th>Available</th>
              <th>Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isEditing = editingId === product.id;
              const available = product.stock - product.sold;
              const revenue = product.sold * product.price;

              return (
                <tr key={product.id} className={available <= 0 ? 'low-stock' : ''}>
                  <td>
                    <div className="inventory-photo-cell">
                      {product.photo ? (
                        <img src={product.photo} alt={product.name} className="inventory-product-photo" />
                      ) : (
                        <div className="inventory-photo-placeholder">📦</div>
                      )}
                    </div>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      <span className="product-name">{product.name}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.stock}
                        onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      <span>{product.stock}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.cost}
                        onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      <span>Rs {product.cost.toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      <span>Rs {product.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    <span className="sold-count">{product.sold}</span>
                  </td>
                  <td>
                    <span className={`available ${available <= 5 ? 'warning' : ''}`}>
                      {available}
                    </span>
                  </td>
                  <td>
                    <span className="revenue">Rs {revenue.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {isEditing ? (
                        <>
                          <button
                            className="btn-small btn-save"
                            onClick={() => handleEditSave(product.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-small btn-cancel"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-small btn-edit"
                            onClick={() => handleEditStart(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-small btn-delete"
                            onClick={() => onDelete(product.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sales-recording">
        <h3>Record Sales</h3>
        <div className="sales-grid">
          {products.map((product) => {
            const available = product.stock - product.sold;
            return (
              <div key={product.id} className="sales-card">
                <h4>{product.name}</h4>
                <p className="stock-info">Available: {available}</p>
                <div className="sale-input-group">
                  <input
                    type="number"
                    min="0"
                    max={available}
                    value={saleData[product.id] || ''}
                    onChange={(e) => setSaleData({ ...saleData, [product.id]: e.target.value })}
                    placeholder="Qty to sell"
                    className="sale-input"
                  />
                  <button
                    className="btn-sale"
                    onClick={() => handleSaleSubmit(product.id)}
                  >
                    Record Sale
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
