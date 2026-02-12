import React, { useState } from 'react';

function AddProduct({ onAddProduct }) {
  const [form, setForm] = useState({
    name: '',
    stock: '',
    cost: '',
    price: '',
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (form.name.length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (form.name.length > 100) {
      newErrors.name = 'Product name must be less than 100 characters';
    }

    if (!form.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (Number(form.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!form.cost) {
      newErrors.cost = 'Cost price is required';
    } else if (Number(form.cost) < 0) {
      newErrors.cost = 'Cost price cannot be negative';
    }

    if (!form.price) {
      newErrors.price = 'Selling price is required';
    } else if (Number(form.price) < 0) {
      newErrors.price = 'Selling price cannot be negative';
    }

    if (form.cost && form.price && Number(form.price) < Number(form.cost)) {
      newErrors.price = 'Selling price must be greater than or equal to cost price';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      onAddProduct(form);
      setForm({ name: '', stock: '', cost: '', price: '', photo: null });
      setPreview(null);
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setForm({ ...form, photo: base64String });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, photo: null });
    setPreview(null);
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>

      {submitted && (
        <div className="success-message">
          ✓ Product added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-section">
          <h3>Product Information</h3>

          {/* Image Upload Section */}
          <div className="image-upload-section">
            <h4>📸 Product Photo (Optional)</h4>
            <div className="image-upload-container">
              <div className="image-preview-area">
                {preview ? (
                  <div className="image-preview">
                    <img src={preview} alt="Product preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={removeImage}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="image-placeholder-upload">
                    <div className="upload-icon">📷</div>
                    <p>No image selected</p>
                  </div>
                )}
              </div>
              <div className="image-upload-input">
                <label htmlFor="photo" className="file-input-label">
                  Choose Photo
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <p className="image-help-text">JPG, PNG or GIF (Max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name (e.g., Laptop, Phone, etc.)"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">Initial Stock Quantity *</label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`form-input ${errors.stock ? 'input-error' : ''}`}
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cost">Cost Price (Rs) *</label>
              <input
                id="cost"
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`form-input ${errors.cost ? 'input-error' : ''}`}
              />
              {errors.cost && <span className="error-message">{errors.cost}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Base Selling Price (Rs) *</label>
              <p className="form-help-text">This is the default price. You can set different prices when recording sales.</p>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>

          {form.cost && form.price && (
            <div className="margin-info">
              <p>
                Profit per unit: <strong>Rs {(Number(form.price) - Number(form.cost)).toFixed(2)}</strong>
                {' '}
                ({form.cost > 0 ? ((((Number(form.price) - Number(form.cost)) / Number(form.cost)) * 100).toFixed(1)) : 0}%)
              </p>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-lg">
            Add Product
          </button>
          <button
            type="button"
            className="btn-secondary btn-lg"
            onClick={() => {
              setForm({ name: '', stock: '', cost: '', price: '', photo: null });
              setPreview(null);
              setErrors({});
            }}
          >
            Clear Form
          </button>
        </div>
      </form>

      <div className="tips-section">
        <h3>💡 Tips</h3>
        <ul>
          <li>Cost price is fixed for each product</li>
          <li>Base selling price can be changed per sale for flexible pricing</li>
          <li>You can set different selling prices when recording sales</li>
          <li>Stock will be tracked automatically. Set correct initial quantity</li>
          <li>You can edit products anytime from the Inventory page</li>
          <li>All data is saved automatically to your browser</li>
        </ul>
      </div>
    </div>
  );
}

export default AddProduct;
