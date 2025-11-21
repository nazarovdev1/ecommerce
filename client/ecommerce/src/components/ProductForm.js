import { Save, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useProducts } from '../contexts/ProductContext'

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts()
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
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load product if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        images: product.images || [],
        badge: product.badge || '',
        rating: product.rating || 0,
        colors: (product.colors || []).join(', '),
        sizes: (product.sizes || []).join(', '),
        description: product.description || '',
      })
    }
  }, [product])

  // Handle text inputs
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Base64 convert
  const convertFileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = err => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // Upload images (multiple)
  const handleFileUpload = async e => {
    const files = Array.from(e.target.files)
    const base64Images = await Promise.all(files.map(file => convertFileToBase64(file)))

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...base64Images], // <-- MUHIM
    }))
  }

  // Remove image
  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Submit
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
        toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!")
        return
      }

      // Backend formatiga o'zgartirish
      const processedData = {
        name: formData.name,
        categoryId: Number(formData.category),
        price: Number(formData.price),
        ...(formData.originalPrice && { old_price: Number(formData.originalPrice) }),
        images: formData.images,
        ...(formData.badge && { status: formData.badge }),
        rating: Number(formData.rating) || 0,
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        dimensions: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        description: formData.description || '',
      }

      if (product) {
        await updateProduct(product.id, processedData)
        toast.success('Mahsulot yangilandi!')
      } else {
        await addProduct(processedData)
        toast.success("Mahsulot qo'shildi!")
      }

      onClose()
    } catch (err) {
      toast.error('Xatolik yuz berdi!')
      console.error('Form submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Basic Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        {/* NAME */}
        <div>
          <label className="block mb-2 text-gray-300">Mahsulot nomi *</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-2 text-gray-300">Kategoriya *</label>
          <input name="category" type="text" value={formData.category} onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* PRICE */}
        <div>
          <label className="block mb-2 text-gray-300">Narx *</label>
          <input name="price" type="text" value={formData.price} onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* RATING */}
        <div>
          <label className="block mb-2 text-gray-300">Reyting</label>
          <input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange}
            placeholder="0-5"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* OLD PRICE */}
        <div>
          <label className="block mb-2 text-gray-300">Eski narx</label>
          <input name="originalPrice" type="text" value={formData.originalPrice} onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="lg:col-span-2">
          <label className="block mb-2 text-gray-300">Rasmlar *</label>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload}
            className="file:bg-accent file:text-white file:px-4 file:py-2 file:rounded-lg" />

          {/* PREVIEW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} className="w-full h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* COLORS */}
        <div>
          <label className="block mb-2 text-gray-300">Ranglar</label>
          <input name="colors" type="text" value={formData.colors} onChange={handleChange}
            placeholder="Qora, Oq, Kulrang"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* SIZES */}
        <div>
          <label className="block mb-2 text-gray-300">O'lchamlar</label>
          <input name="sizes" type="text" value={formData.sizes} onChange={handleChange}
            placeholder="S, M, L, XL"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>

        {/* DESCRIPTION */}
        <div className="lg:col-span-2">
          <label className="block mb-2 text-gray-300">Tavsif</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-700 rounded-lg text-white">Bekor</button>
        <button type="submit" disabled={isSubmitting}
          className="px-6 py-2 bg-accent rounded-lg text-white flex items-center gap-2">
          {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>

    </form>
  )
}

export default ProductForm
