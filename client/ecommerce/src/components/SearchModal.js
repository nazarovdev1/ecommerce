import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'

const SearchModal = ({ isOpen, onClose }) => {
	// EN: Search input state
	// UZ: Qidiruv uchun input qiymati
	const [searchQuery, setSearchQuery] = useState('')

	// EN: Filtered results based on search query
	// UZ: Qidiruvdan chiqqan mahsulotlar ro'yxati
	const [searchResults, setSearchResults] = useState([])

	// EN: Get all products from global context
	// UZ: Barcha mahsulotlarni ProductContext dan olish
	const { products } = useProducts()

	const navigate = useNavigate()

	// ---------------------- PRODUCT SEARCH LOGIC -------------------------

	useEffect(() => {
		// EN: If search input is empty → clear results
		// UZ: Agar qidiruv bo'sh bo'lsa → natijalarni tozalash
		if (searchQuery.trim() === '') {
			setSearchResults([])
			return
		}

		// EN: Filter products by name match (case insensitive)
		// UZ: Mahsulot nomiga qarab filtr qilish (kichik-katta harf farqsiz)
		const filtered = products.filter(product =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase())
		)

		setSearchResults(filtered)
	}, [searchQuery, products])

	// ---------------------- ESCAPE (ESC) SHORTCUT -------------------------

	useEffect(() => {
		const handleKeyDown = e => {
			// EN: Escape closes modal
			// UZ: ESC bosilganda modal yopiladi
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	// ------------------------ NAVIGATE TO PRODUCT ------------------------

	const handleProductClick = productId => {
		// EN: Navigate to product page
		// UZ: Mahsulot sahifasiga o'tish
		navigate(`/product/${productId}`)

		onClose() // Close modal
		setSearchQuery('') // Clear input
	}

	// ------------------------ OVERLAY CLICK CLOSE -------------------------

	const handleOverlayClick = e => {
		// EN: If clicked outside modal, close it
		// UZ: Modal tashqarisiga bosilsa — yopiladi
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	// If modal is closed → render nothing
	if (!isOpen) return null

	// ---------------------------- UI STARTS ------------------------------

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4'
			onClick={handleOverlayClick}
		>
			<div className='bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden'>
				{/* ----------------------- HEADER ----------------------- */}
				<div className='p-6 border-b border-gray-700'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-xl font-bold text-white'>Mahsulot qidirish</h2>

						{/* Close button */}
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-white transition-colors'
						>
							<X className='w-6 h-6' />
						</button>
					</div>

					{/* Search input */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />

						<input
							type='text'
							placeholder='Mahsulot nomini kiriting...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-accent focus:border-transparent'
							autoFocus
						/>
					</div>
				</div>

				{/* ----------------------- RESULTS AREA ----------------------- */}
				<div className='max-h-96 overflow-y-auto'>
					{/* No input yet */}
					{searchQuery.trim() === '' ? (
						<div className='p-8 text-center text-gray-400'>
							<Search className='w-12 h-12 mx-auto mb-4 opacity-50' />
							<p>Qidirish uchun mahsulot nomini kiriting</p>
						</div>
					) : searchResults.length === 0 ? (
						// No results found
						<div className='p-8 text-center text-gray-400'>
							<Search className='w-12 h-12 mx-auto mb-4 opacity-50' />
							<p>"{searchQuery}" uchun natija topilmadi</p>
						</div>
					) : (
						// Results list
						<div className='p-4'>
							<div className='mb-4 text-sm text-gray-400'>
								{searchResults.length} ta natija topildi
							</div>

							<div className='space-y-2'>
								{searchResults.map(product => (
									<div
										key={product.id}
										onClick={() => handleProductClick(product.id)}
										className='flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 
                               cursor-pointer transition-colors'
									>
										{/* Product image */}
										<img
											src={product.image}
											alt={product.name}
											className='w-12 h-12 object-cover rounded-lg'
										/>

										{/* Name + Category */}
										<div className='flex-1'>
											<h3 className='text-white font-medium'>{product.name}</h3>
											<p className='text-gray-400 text-sm'>
												{product.category}
											</p>
										</div>

										{/* Price + badge */}
										<div className='text-right'>
											<div className='text-white font-semibold'>
												{product.price}
											</div>

											{product.badge && (
												<span
													className={`text-xs px-2 py-1 rounded ${
														product.badge === 'NEW'
															? 'bg-accent text-accent-foreground'
															: 'bg-yellow-500 text-black'
													}`}
												>
													{product.badge}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* ----------------------- FOOTER ------------------------ */}
				<div className='p-4 border-t border-gray-700 bg-gray-900'>
					<div className='flex items-center justify-between text-sm text-gray-400'>
						<span>ESC - yopish</span>
						<span>Enter - tanlash</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SearchModal
