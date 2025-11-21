import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { ArrowLeft, Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react'
import ImageCarousel from '../components/ImageCarousel'

const ProductView = () => {
	const { id } = useParams()
	// EN: Get product ID from the URL
	// UZ: URL ichidan mahsulot ID sini olish

	const { getProduct } = useProducts()
	const { addToCart } = useCart()

	const product = getProduct(id)
	// EN: Fetch product data by ID
	// UZ: ID bo‘yicha mahsulot ma’lumotini olish

	const [selectedColor, setSelectedColor] = useState('')
	const [selectedSize, setSelectedSize] = useState('')
	const [quantity, setQuantity] = useState(1)
	// EN: Local states for user selections
	// UZ: Foydalanuvchi tanlovlari uchun lokal holatlar

	const [isAddingToCart, setIsAddingToCart] = useState(false)
	// EN: Loading state for "Add to Cart"
	// UZ: Savatga qo‘shish jarayoni holati

	// If product not found
	if (!product) {
		// EN: Show fallback page if product doesn't exist
		// UZ: Mahsulot mavjud bo‘lmasa xatolik sahifasini ko‘rsatish
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-white mb-4'>
						Mahsulot topilmadi
					</h1>
					<Link
						to='/'
						className='inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors'
					>
						<ArrowLeft className='w-5 h-5' />
						<span>Bosh sahifaga qaytish</span>
					</Link>
				</div>
			</div>
		)
	}

	const handleAddToCart = async () => {
		// EN: Validate color selection if product has colors
		// UZ: Rang mavjud bo‘lsa, rang tanlanganini tekshirish
		if (product.colors && product.colors.length > 0 && !selectedColor) {
			toast.error('Iltimos, rang tanlang!', { duration: 6000 })
			return
		}

		// EN: Validate size selection if product has sizes
		// UZ: O‘lchamlar bo‘lsa, o‘lcham tanlanganini tekshirish
		if (product.sizes && product.sizes.length > 0 && !selectedSize) {
			toast.error("Iltimos, o'lcham tanlang!", { duration: 6000 })
			return
		}

		setIsAddingToCart(true) // EN: Start loading | UZ: Jarayon boshlandi

		try {
			// EN: Try adding product to cart
			// UZ: Mahsulotni savatga qo‘shishga harakat qilish
			await addToCart(product, selectedColor, selectedSize, quantity)

			toast.success(`"${product.name || product.title}" savatga qo'shildi! (${quantity} dona)`)
		} catch (error) {
			console.error('Error adding to cart:', error)
			toast.error('Xatolik yuz berdi.')
		} finally {
			setIsAddingToCart(false) // EN: End loading | UZ: Jarayon tugadi
		}
	}

	const renderStars = rating => {
		// EN: Display rating stars based on product rating
		// UZ: Reyting bo‘yicha yulduzlarni chiqarish
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-5 h-5 ${
					i < Math.floor(rating)
						? 'text-yellow-400 fill-current'
						: 'text-gray-400'
				}`}
			/>
		))
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* Back button */}
			<div className='sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800'>
				{/* EN: Stays fixed when scrolling  
            UZ: Scroll bo‘lsa ham tepada turadi */}
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<button
						onClick={() => window.history.back()}
						className='inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors'
					>
						<ArrowLeft className='w-5 h-5' />
						<span>Orqaga</span>
					</button>
				</div>
			</div>

			{/* Main Product Layout */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
					{/* Image Carousel */}
					<div className='space-y-4'>
						<ImageCarousel
							images={product.images || [product.image].filter(Boolean)}
							productName={product.name}
						/>
						{/* EN: Product images slider  
                UZ: Mahsulot rasmlari slayderi */}

						{/* Product Badge */}
						{product.badge && (
							<div className='inline-block'>
								<span
									className={`px-4 py-2 text-sm font-semibold rounded-full ${
										product.badge === 'NEW'
											? 'bg-accent text-accent-foreground'
											: 'bg-yellow-500 text-black'
									}`}
								>
									{product.badge}
								</span>
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className='space-y-6'>
						{/* Category */}
						<span className='text-sm text-gray-400 uppercase tracking-wide'>
							{product.category}
						</span>

						{/* Title */}
						<h1 className='text-3xl md:text-4xl font-bold text-white'>
							{product.name}
						</h1>

						{/* Rating */}
						<div className='flex items-center space-x-2'>
							{renderStars(product.rating || 0)}
							<span className='text-gray-400'>
								({product.rating || 0} baho)
							</span>
						</div>

						{/* Price */}
						<div className='flex items-center space-x-4'>
							<span className='text-3xl font-bold text-white'>
								{product.price}
							</span>

							{product.originalPrice && (
								<span className='text-xl text-gray-400 line-through'>
									{product.originalPrice}
								</span>
							)}
						</div>

						{/* Description */}
						{product.description && (
							<div>
								<h3 className='text-lg font-semibold text-white mb-2'>
									Tavsif
								</h3>
								<p className='text-gray-300 leading-relaxed'>
									{product.description}
								</p>
							</div>
						)}

						{/* Colors */}
						{product.colors && (
							<div>
								<h3 className='text-lg font-semibold text-white mb-3'>
									Rang tanlang *
								</h3>

								{/* EN: Available colors  
                    UZ: Mavjud ranglar */}
								<div className='flex flex-wrap gap-2'>
									{product.colors.map((color, i) => (
										<button
											key={i}
											onClick={() => setSelectedColor(color)}
											className={`px-4 py-2 rounded-lg text-sm font-medium ${
												selectedColor === color
													? 'bg-accent text-accent-foreground'
													: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
											}`}
										>
											{color}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Sizes */}
						{product.sizes && (
							<div>
								<h3 className='text-lg font-semibold text-white mb-3'>
									O'lcham tanlang *
								</h3>

								{/* EN: Available sizes  
                    UZ: Mavjud o‘lchamlar */}
								<div className='flex flex-wrap gap-2'>
									{product.sizes.map((size, i) => (
										<button
											key={i}
											onClick={() => setSelectedSize(size)}
											className={`px-4 py-2 rounded-lg text-sm font-medium ${
												selectedSize === size
													? 'bg-accent text-accent-foreground'
													: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Quantity */}
						<div>
							<h3 className='text-lg font-semibold text-white mb-3'>Soni</h3>

							{/* EN: Quantity selector  
                  UZ: Soni tanlash */}
							<div className='flex items-center space-x-4'>
								<button
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className='p-2 bg-gray-700 hover:bg-gray-600 rounded-lg'
								>
									<Minus className='w-4 h-4' />
								</button>

								<span className='text-xl text-white min-w-[3rem] text-center'>
									{quantity}
								</span>

								<button
									onClick={() => setQuantity(quantity + 1)}
									className='p-2 bg-gray-700 hover:bg-gray-600 rounded-lg'
								>
									<Plus className='w-4 h-4' />
								</button>
							</div>
						</div>

						{/* Buttons */}
						<div className='flex space-x-4 pt-6'>
							{/* Add to Cart */}
							<button
								onClick={handleAddToCart}
								disabled={isAddingToCart}
								className='flex-1 flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 px-6 py-3 rounded-lg font-semibold'
							>
								{isAddingToCart ? (
									// EN: Loading spinner | UZ: Yuklanish belgisi
									<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground'></div>
								) : (
									<ShoppingCart className='w-5 h-5' />
								)}

								<span>
									{isAddingToCart ? "Qo'shilmoqda..." : "Savatga qo'shish"}
								</span>
							</button>

							{/* Wishlist */}
							<button className='p-3 bg-gray-700 hover:bg-gray-600 rounded-lg'>
								<Heart className='w-5 h-5' />
							</button>
						</div>

						{/* Extra info */}
						<div className='border-t border-gray-700 pt-6 mt-8'>
							{/* EN: Shipping, Warranty, Return info  
                  UZ: Yetkazish, Kafolat, Qaytarish ma’lumoti */}
							<div className='grid grid-cols-1 md:grid-cols-3 text-center'>
								<div>
									<div className='text-accent font-semibold'>Tez yetkazish</div>
									<div className='text-gray-400 text-sm'>24-48 soat</div>
								</div>

								<div>
									<div className='text-accent font-semibold'>Kafolat</div>
									<div className='text-gray-400 text-sm'>1 yil</div>
								</div>

								<div>
									<div className='text-accent font-semibold'>Qaytarish</div>
									<div className='text-gray-400 text-sm'>7 kun</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductView
