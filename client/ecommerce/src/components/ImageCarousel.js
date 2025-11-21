import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

const ImageCarousel = ({ images, productName }) => {
	const [currentIndex, setCurrentIndex] = useState(0) // EN: Current displayed image index
	// UZ: Hozir ko‘rsatilayotgan rasm indeks
	const [isModalOpen, setIsModalOpen] = useState(false) // EN: Fullscreen modal state
	// UZ: To‘liq ekran modal holati

	// If no images → don't render anything
	if (!images || images.length === 0) return null

	/* ===================================================
      SLIDER NAVIGATION
      EN: Next/prev image logic
      UZ: Keyingi / oldingi rasmga o'tish
  =================================================== */
	const nextImage = () => {
		setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
	}

	const prevImage = () => {
		setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
	}

	const goToImage = index => setCurrentIndex(index)

	return (
		<>
			{/* ===================================================
          MAIN IMAGE (PRODUCT PAGE)
          EN: Main carousel image + arrows + counter
          UZ: Asosiy rasm + navigatsiya tugmalari + hisoblagich
      =================================================== */}
			<div
				className='relative group cursor-pointer'
				onClick={() => setIsModalOpen(true)}
			>
				<div className='aspect-square bg-gray-800 rounded-xl overflow-hidden'>
					<img
						src={images[currentIndex]}
						alt={`${productName} - ${currentIndex + 1}`}
						className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				</div>

				{/* Left/Right Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={e => {
								e.stopPropagation()
								prevImage()
							}}
							className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
						>
							<ChevronLeft className='w-6 h-6' />
						</button>

						<button
							onClick={e => {
								e.stopPropagation()
								nextImage()
							}}
							className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
						>
							<ChevronRight className='w-6 h-6' />
						</button>
					</>
				)}

				{/* Image Counter */}
				<div className='absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
					{currentIndex + 1} / {images.length}
				</div>
			</div>

			{/* ===================================================
          THUMBNAILS
          EN: Small preview images
          UZ: Kichik mini-ramslar (thumbnails)
      =================================================== */}
			{images.length > 1 && (
				<div className='flex space-x-2 mt-7 overflow-x-auto pb-2'>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => goToImage(index)}
							className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
								index === currentIndex
									? 'border-accent scale-110'
									: 'border-gray-600 hover:border-gray-400'
							}`}
						>
							<img
								src={image}
								alt={`${productName} thumbnail ${index + 1}`}
								className='w-full h-full object-cover'
							/>
						</button>
					))}
				</div>
			)}

			{/* ===================================================
          FULLSCREEN MODAL VIEW
          EN: Opened when user clicks main image
          UZ: Asosiy rasm bosilganda ochiladigan to‘liq ekran modal
      =================================================== */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
					<div className='relative max-w-4xl max-h-full'>
						{/* Close Button */}
						<button
							onClick={() => setIsModalOpen(false)}
							className='absolute -top-12 right-0 text-white hover:text-gray-300'
						>
							<X className='w-8 h-8' />
						</button>

						{/* Modal Image */}
						<div className='relative'>
							<img
								src={images[currentIndex]}
								alt={`${productName} - ${currentIndex + 1}`}
								className='max-w-full max-h-[80vh] object-contain'
							/>

							{/* Modal Navigation Arrows */}
							{images.length > 1 && (
								<>
									<button
										onClick={prevImage}
										className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full'
									>
										<ChevronLeft className='w-6 h-6' />
									</button>

									<button
										onClick={nextImage}
										className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full'
									>
										<ChevronRight className='w-6 h-6' />
									</button>
								</>
							)}

							{/* Modal Counter */}
							<div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full'>
								{currentIndex + 1} / {images.length}
							</div>
						</div>

						{/* Modal Thumbnails */}
						{images.length > 1 && (
							<div className='flex justify-center space-x-2 mt-4 overflow-x-auto pb-2'>
								{images.map((image, index) => (
									<button
										key={index}
										onClick={() => goToImage(index)}
										className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
											index === currentIndex
												? 'border-accent scale-110'
												: 'border-gray-600 hover:border-gray-400'
										}`}
									>
										<img
											src={image}
											alt={`${productName} modal thumbnail ${index + 1}`}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default ImageCarousel
