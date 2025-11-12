import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { X, Upload, Save } from 'lucide-react';

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    images: [],
    badge: '',
    rating: 0,
    colors: '',
    sizes: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        images: product.images || [product.image].filter(Boolean),
        badge: product.badge || '',
        rating: product.rating || 0,
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
        description: product.description || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => convertFileToBase64(file));
    const images = await Promise.all(imagePromises);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...images],
      image: images[0] // Set first image as main image for backward compatibility
    }));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    const imagePromises = files.map(file => convertFileToBase64(file));
    const images = await Promise.all(imagePromises);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...images],
      image: prev.image || images[0] // Set first image as main if not set
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: index === 0 && newImages.length > 0 ? newImages[0] : prev.image
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price || !formData.images || formData.images.length === 0) {
        alert('Iltimos, barcha majburiy maydonlarni to\'ldiring va kamida bitta rasm yuklang!');
        return;
      }

      // Convert colors and sizes strings to arrays
      const processedData = {
        ...formData,
        colors: formData.colors ? formData.colors.split(',').map(item => item.trim()).filter(item => item) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(item => item.trim()).filter(item => item) : []
      };

      if (product) {
        // Update existing product
        updateProduct(product.id, processedData);
        alert('Mahsulot muvaffaqiyatli yangilandi!');
      } else {
        // Add new product
        addProduct(processedData);
        alert('Mahsulot muvaffaqiyatli qo\'shildi!');
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mahsulot nomi *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Masalan: Zamonaviy ko'ylak"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kategoriya *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            required
          >
            <option value="">Kategoriyani tanlang</option>
            <option value="Kombinezonlar">Kombinezonlar</option>
            <option value="Ko'ylaklar">Ko'ylaklar</option>
            <option value="Sviterlar">Sviterlar</option>
            <option value="Tuflilar">Tuflilar</option>
            <option value="Blazerlar">Blazerlar</option>
            <option value="Yubkalar">Yubkalar</option>
            <option value="Paltolar">Paltolar</option>
            <option value="Shalvarlar">Shalvarlar</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Narx *
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="$299"
            required
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Eski narx (ixtiyoriy)
          </label>
          <input
            type="text"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="$399"
          />
        </div>

        {/* Multiple Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mahsulot rasmlari * (bir nechta tanlashingiz mumkin)
          </label>

          {/* File Input */}
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer mb-4"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">
              Rasmni bu yerga sudrab qo'ying yoki bosing
            </p>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, GIF formatlarni qo'llab-quvvatlaydi
            </p>
          </div>

          {/* Image Preview Gallery */}
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                      Asosiy
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badge */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status (ixtiyoriy)
          </label>
          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">Status yo'q</option>
            <option value="NEW">Yangi</option>
            <option value="BESTSELLER">Bestseller</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reyting (0-5)
          </label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="4.5"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ranglar (vergul bilan ajrating)
          </label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Qora, Oq, Kulrang"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            O'lchamlar (vergul bilan ajrating)
          </label>
          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="S, M, L, XL"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tavsif (ixtiyoriy)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            placeholder="Mahsulot haqida batafsil ma'lumot..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground"></div>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{product ? 'Saqlash' : 'Qo\'shish'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
