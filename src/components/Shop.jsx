import React, { useState } from 'react';

function Shop({ products }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    const available = product.stock - product.sold;
    
    if (quantity > available) {
      alert(`Only ${available} items available`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all customer details');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Create order summary
    const orderData = {
      id: Date.now(),
      customer: customerInfo,
      items: cart,
      total: cartTotal,
      date: new Date().toLocaleString(),
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    setOrderPlaced(true);
    setCart([]);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCart(false);
    }, 3000);
  };

  return (
    <div className="shop">
      <div className="shop-header">
        <h2>🛍️ Shop</h2>
        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart ({cartCount})
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {orderPlaced && (
        <div className="order-success">
          ✓ Order placed successfully! Thank you for your purchase.
        </div>
      )}

      <div className="shop-container">
        {/* Product Display */}
        <div className={`shop-products ${showCart ? 'cart-open' : ''}`}>
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products available. Add products from Inventory first! 📦</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const available = product.stock - product.sold;
                const inStock = available > 0;
                
                return (
                  <div key={product.id} className={`product-card ${inStock ? '' : 'out-of-stock'}`}>
                    <div className="product-image">
                      {product.photo ? (
                        <img src={product.photo} alt={product.name} className="product-photo" />
                      ) : (
                        <div className="image-placeholder">
                          📦
                        </div>
                      )}
                      {!inStock && <div className="stock-badge">Out of Stock</div>}
                      {available <= 5 && available > 0 && (
                        <div className="low-stock-badge">Only {available} Left!</div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      
                      <div className="product-pricing">
                        <div className="price-section">
                          <span className="price-label">Price</span>
                          <span className="price">Rs {product.price.toLocaleString()}</span>
                        </div>
                        <div className="stock-section">
                          <span className="available-label">Available</span>
                          <span className={`stock-count ${available <= 5 ? 'warning' : ''}`}>
                            {available} units
                          </span>
                        </div>
                      </div>

                      <div className="product-meta">
                        <span className="meta-item">
                          <strong>Cost:</strong> Rs {product.cost.toLocaleString()}
                        </span>
                        <span className="meta-item">
                          <strong>Sold:</strong> {product.sold} units
                        </span>
                      </div>

                      <button
                        className={`btn-add-to-cart ${inStock ? '' : 'disabled'}`}
                        onClick={() => addToCart(product)}
                        disabled={!inStock}
                      >
                        {inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="shop-cart">
            <div className="cart-header">
              <h3>🛒 Shopping Cart</h3>
              <button 
                className="close-cart"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-price">Rs {item.price.toLocaleString()}</p>
                      </div>

                      <div className="item-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="qty-input"
                          min="1"
                        />
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </div>

                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-divider"></div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>Rs {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Items:</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>Rs {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="cart-divider"></div>

                <div className="checkout-section">
                  <h4>📋 Customer Details</h4>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="checkout-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="checkout-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="checkout-input"
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      placeholder="Delivery Address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="checkout-input checkout-textarea"
                      rows="3"
                    ></textarea>
                  </div>

                  <button
                    className="btn-checkout"
                    onClick={handlePlaceOrder}
                  >
                    ✓ Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
