import {
	ArrowLeft,
	MapPin,
	MessageSquare,
	Phone,
	Send,
	ShoppingBag,
	User,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const Order = () => {
	const { items, getCartTotal, clearCart } = useCart()
	const navigate = useNavigate()

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		address: '',
		comments: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [orderPlaced, setOrderPlaced] = useState(false)

	// EN: Calculate totals
	// UZ: Jami hisoblash
	const subtotal = getCartTotal()
	const deliveryFee = subtotal > 200 ? 0 : 5 // EN: Free delivery over $200 | UZ: 200$ dan yuqori bo'lsa bepul yetkazish
	const total = subtotal + deliveryFee

	// EN: Handle form input changes
	// UZ: Forma ma'lumotlarini o'zgartirish
	const handleChange = e => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	// EN: Submit order to backend
	// UZ: Zakasni backendga yuborish
	const handleSubmit = async e => {
		e.preventDefault()

		// EN: Validate required fields
		// UZ: Majburiy maydonlarni tekshirish
		if (
			!formData.name.trim() ||
			!formData.phone.trim() ||
			!formData.address.trim()
		) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!")
			return
		}

		if (items.length === 0) {
			toast.error("Savat bo'sh!")
			return
		}

		setIsSubmitting(true)

		try {
			// EN: Prepare order data
			// UZ: Zakas ma'lumotlarini tayyorlash
			const orderData = {
				customer: formData,
				items: items,
				totals: {
					subtotal: subtotal,
					deliveryFee: deliveryFee,
					total: total,
				},
			}

			// EN: Send to backend
			// UZ: Backendga yuborish
			const response = await fetch('http://localhost:3003/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData),
			})

			const result = await response.json()

			if (result.success) {
				toast.success('Buyurtma muvaffaqiyatli yuborildi! 🚀')
				clearCart() // EN: Clear cart | UZ: Savatni tozalash
				setOrderPlaced(true) // EN: Show success state | UZ: Muvaffaqiyat holatini ko'rsatish
			} else {
				toast.error('Xatolik yuz berdi. Qayta urining.')
			}
		} catch (error) {
			console.error('Order submission error:', error)
			toast.error('Xatolik yuz berdi. Internet aloqasini tekshiring.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* EN: Header with back button
            UZ: Orqaga qaytish tugmasi bilan header */}
			<div className='sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<Link
						to='/'
						className='inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors'
					>
						<ArrowLeft className='w-5 h-5' />
						<span>Orqaga</span>
					</Link>
				</div>
			</div>

			{/* EN: Main content
            UZ: Asosiy kontent */}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* EN: Order Form Section
                    UZ: Zakas formasi qismi */}
					<div>
						<div className='bg-gray-800 rounded-xl p-6'>
							<h1 className='text-2xl font-bold text-white mb-6'>
								Buyurtma ma'lumotlari
							</h1>

							<form onSubmit={handleSubmit} className='space-y-6'>
								{/* EN: Name field
                                UZ: Ism */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										<User className='w-4 h-4 inline mr-1' />
										Ism Familiya *
									</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleChange}
										className='w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-accent focus:ring-accent'
										placeholder='Masalan: Ali Valiyev'
										required
									/>
								</div>

								{/* EN: Phone field
                                UZ: Telefon */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										<Phone className='w-4 h-4 inline mr-1' />
										Telefon raqam *
									</label>
									<input
										type='tel'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										className='w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-accent focus:ring-accent'
										placeholder='+998 90 123 45 67'
										required
									/>
								</div>

								{/* EN: Address field
                                UZ: Manzil */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										<MapPin className='w-4 h-4 inline mr-1' />
										Manzil *
									</label>
									<textarea
										name='address'
										value={formData.address}
										onChange={handleChange}
										rows={3}
										className='w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-accent focus:ring-accent resize-none'
										placeholder='Toshkent shahri, Yunusobod tumani, 1-uy'
										required
									/>
								</div>

								{/* EN: Comments field
                                UZ: Izohlar */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										<MessageSquare className='w-4 h-4 inline mr-1' />
										Qo'shimcha izohlar
									</label>
									<textarea
										name='comments'
										value={formData.comments}
										onChange={handleChange}
										rows={3}
										className='w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-accent focus:ring-accent resize-none'
										placeholder="Qo'shimcha maʼlumotlar"
									/>
								</div>

								{/* EN: Submit button
                                UZ: Yuborish tugmasi */}
								<button
									type='submit'
									disabled={isSubmitting}
									className='w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
								>
									{isSubmitting ? (
										<>
											<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground'></div>
											<span>Yuborilmoqda...</span>
										</>
									) : (
										<>
											<Send className='w-5 h-5' />
											<span>Buyurtma berish</span>
										</>
									)}
								</button>
							</form>
						</div>
					</div>

					{/* EN: Order Summary Section
                    UZ: Zakas umumiy maʼlumotlari */}
					<div>
						<div className='bg-gray-800 rounded-xl p-6 sticky top-24'>
							<h2 className='text-xl font-semibold text-white mb-6 flex items-center space-x-2'>
								<ShoppingBag className='w-5 h-5' />
								<span>Buyurtma mazmuni</span>
							</h2>

							{/* EN: Cart items summary
                            UZ: Savat mahsulotlari umumiy maʼlumotlari */}
							<div className='space-y-4 mb-6'>
								{items.map(item => {
									const price =
										typeof item.price === 'string'
											? parseFloat(item.price.replace('$', ''))
											: item.price
									const itemTotal = price * item.quantity

									return (
										<div key={item.id} className='flex space-x-3'>
											<img
												src={item.image}
												alt={item.name}
												className='w-12 h-12 object-cover rounded-lg'
											/>
											<div className='flex-1 min-w-0'>
												<h3 className='text-white font-medium text-sm truncate'>
													{item.name}
												</h3>
												<p className='text-gray-400 text-xs'>
													{item.quantity} dona • ${price.toFixed(2)} har biri
												</p>
												{item.selectedColor && (
													<p className='text-gray-400 text-xs'>
														Rang: {item.selectedColor}
													</p>
												)}
												{item.selectedSize && (
													<p className='text-gray-400 text-xs'>
														O'lcham: {item.selectedSize}
													</p>
												)}
											</div>
											<div className='text-white font-semibold text-sm'>
												${itemTotal.toFixed(2)}
											</div>
										</div>
									)
								})}
							</div>

							{/* EN: Pricing summary
                            UZ: Narx umumiy hisobi */}
							<div className='border-t border-gray-700 pt-4 space-y-2'>
								<div className='flex justify-between text-gray-300'>
									<span>Mahsulotlar jami:</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className='flex justify-between text-gray-300'>
									<span>Yetkazib berish:</span>
									<span>
										{deliveryFee === 0 ? 'Bepul' : `$${deliveryFee.toFixed(2)}`}
									</span>
								</div>
								<div className='flex justify-between text-white font-bold text-lg border-t border-gray-600 pt-2'>
									<span>Umumiy:</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>

							{/* EN: Delivery info
                            UZ: Yetkazish haqida maʼlumot */}
							<div className='mt-6 p-4 bg-gray-700 rounded-lg'>
								<h3 className='text-white font-semibold mb-2'>
									Yetkazib berish
								</h3>
								<p className='text-gray-300 text-sm'>
									Buyurtma 24-48 soat ichida yetkazib beriladi.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Order
