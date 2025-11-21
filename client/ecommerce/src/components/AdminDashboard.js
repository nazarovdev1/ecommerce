import { Edit, LogOut, Package, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProducts } from '../contexts/ProductContext'
import ProductForm from './ProductForm'

const AdminDashboard = () => {
	// EN: Load products and delete function from context
	// UZ: Mahsulotlar va o'chirish funksiyasini contextdan olish
	const { products, removeProduct, isLoading } = useProducts()

	// EN: Logout function (admin chiqishi)
	// UZ: Tizimdan chiqish funksiyasi
	const { logout } = useAuth()

	// EN: Controls form visibility
	// UZ: Formani ko‘rsatish/yopishni boshqarish
	const [showForm, setShowForm] = useState(false)

	// EN: Store product being edited
	// UZ: Tahrirlanayotgan mahsulotni saqlash
	const [editingProduct, setEditingProduct] = useState(null)

	// -------------------------
	// FORM OPENING HANDLERS
	// -------------------------

	// EN: Open form for adding new product
	// UZ: Yangi mahsulot qo‘shish formasini ochish
	const handleAddNew = () => {
		setEditingProduct(null)
		setShowForm(true)
	}

	// EN: Open form with product data for editing
	// UZ: Mahsulotni tahrirlash uchun formani ochish
	const handleEdit = product => {
		setEditingProduct(product)
		setShowForm(true)
	}

	// EN: Delete product with confirmation
	// UZ: Mahsulotni tasdiq bilan o'chirish
	const handleDelete = id => {
		if (window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
			removeProduct(id)
		}
	}

	// EN: Close form and reset editing data
	// UZ: Formani yopish va tahrirlash ma’lumotini tozalash
	const handleFormClose = () => {
		setShowForm(false)
		setEditingProduct(null)
	}

	// -------------------------
	// LOADING STATE
	// -------------------------
	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent'></div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* ============================
          HEADER  
          EN: Admin top bar
          UZ: Admin bosh menyu
      ============================= */}
			<div className='bg-gray-800 border-b border-gray-700'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
					<div className='flex justify-between items-center'>
						{/* Left section (title) */}
						<div className='flex items-center space-x-3'>
							<Package className='h-8 w-8 text-accent' />
							<div>
								<h1 className='text-2xl font-bold text-white'>Admin Panel</h1>
								<p className='text-gray-400'>Mahsulotlar boshqaruvi</p>
							</div>
						</div>

						{/* Right section buttons */}
						<div className='flex items-center space-x-4'>
							{/* EN: Add new product | UZ: Yangi mahsulot qo‘shish */}
							<button
								onClick={handleAddNew}
								className='flex items-center space-x-4 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors'
							>
								<Plus className='h-5 w-5' />
								<span>Yangi mahsulot</span>
							</button>

							{/* EN: Admin logout | UZ: Chiqish */}
							<button
								onClick={logout}
								className='flex items-center space-x-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors'
							>
								<LogOut className='h-5 w-5' />
								<span>Chiqish</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* ============================
          CONTENT AREA
      ============================= */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* -------------------------
            PRODUCT FORM (Add/Edit)
        -------------------------- */}
				{showForm ? (
					<div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
						<div className='flex justify-between items-center mb-6'>
							{/* EN: Form title changes based on mode  
                  UZ: Forma sarlavhasi rejimga qarab o‘zgaradi */}
							<h2 className='text-xl font-bold text-white'>
								{editingProduct
									? 'Mahsulotni tahrirlash'
									: "Yangi mahsulot qo'shish"}
							</h2>

							<button
								onClick={handleFormClose}
								className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg'
							>
								Bekor qilish
							</button>
						</div>

						<ProductForm product={editingProduct} onClose={handleFormClose} />
					</div>
				) : (
					/* -----------------------------------
             PRODUCT STATS + PRODUCT TABLE
          ------------------------------------- */
					<div className='bg-gray-800 rounded-xl border border-gray-700 overflow-hidden'>
						{/* Stats */}
						<div className='p-6 border-b border-gray-700'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
								{/* EN: Total products | UZ: Jami mahsulotlar */}
								<div>
									<div className='text-3xl font-bold text-accent mb-2'>
										{products.length}
									</div>
									<div className='text-gray-400'>Jami mahsulotlar</div>
								</div>

								{/* EN: New products count | UZ: Yangi mahsulotlar */}
								<div>
									<div className='text-3xl font-bold text-accent mb-2'>
										{products.filter(p => p.status === 'new').length}
									</div>
									<div className='text-gray-400'>Yangi mahsulotlar</div>
								</div>

								{/* EN: Bestsellers count | UZ: Bestsellerlar */}
								<div>
									<div className='text-3xl font-bold text-accent mb-2'>
										{products.filter(p => p.status === 'bestseller').length}
									</div>
									<div className='text-gray-400'>Bestsellerlar</div>
								</div>
							</div>
						</div>

						{/* -------------------------
                PRODUCT LIST TABLE
            -------------------------- */}
						{products.length === 0 ? (
							// EN: When no products exist
							// UZ: Mahsulotlar bo‘lmasa
							<div className='p-12 text-center'>
								<Package className='h-16 w-16 text-gray-600 mx-auto mb-4' />
								<h3 className='text-xl font-semibold text-gray-400 mb-2'>
									Mahsulotlar topilmadi
								</h3>
								<p className='text-gray-500 mb-6'>
									Hali hech qanday mahsulot qo'shilmagan
								</p>

								<button
									onClick={handleAddNew}
									className='inline-flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold'
								>
									<Plus className='h-5 w-5' />
									<span>Birinchi mahsulotni qo'shing</span>
								</button>
							</div>
						) : (
							// EN: Product table
							// UZ: Mahsulotlar jadvali
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead className='bg-gray-700'>
										<tr>
											<th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
												Mahsulot
											</th>
											<th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
												Kategoriya
											</th>
											<th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
												Narx
											</th>
											<th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
												Status
											</th>
											<th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
												Amallar
											</th>
										</tr>
									</thead>

									<tbody className='divide-y divide-gray-700'>
										{products.map(product => (
											<tr key={product.id} className='hover:bg-gray-700/50'>
												{/* PRODUCT INFO */}
												<td className='px-6 py-4'>
													<div className='flex items-center'>
														<img
															className='h-12 w-12 rounded-lg object-cover'
															src={product.images?.[0]}
															alt={product.title}
														/>
														<div className='ml-4'>
															<div className='text-sm font-medium text-white'>
																{product.title}
															</div>
															<div className='text-sm text-gray-400'>
																ID: {product.id}
															</div>
														</div>
													</div>
												</td>

												{/* CATEGORY */}
												<td className='px-6 py-4 text-sm text-gray-300'>
													{product.categoryId}
												</td>

												{/* PRICE */}
												<td className='px-6 py-4 text-sm font-semibold text-white'>
													${product.price}
												</td>

												{/* STATUS BADGE */}
												<td className='px-6 py-4'>
													{product.status && (
														<span
															className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																product.status === 'new'
																	? 'bg-accent text-accent-foreground'
																	: 'bg-yellow-500 text-black'
															}`}
														>
															{product.status.toUpperCase()}
														</span>
													)}
												</td>

												{/* ACTION BUTTONS */}
												<td className='px-6 py-4 text-sm font-medium'>
													<div className='flex items-center space-x-5'>
														{/* EN: Edit product | UZ: Tahrirlash */}
														<button
															onClick={() => handleEdit(product)}
															className='text-blue-400 hover:text-blue-300'
														>
															<Edit className='h-5 w-5' />
														</button>

														{/* EN: Delete product | UZ: O'chirish */}
														<button
															onClick={() => handleDelete(product.id)}
															className='text-red-400 hover:text-red-300'
														>
															<Trash2 className='h-5 w-5' />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminDashboard
