import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
	return (
		<section
			id='hero'
			className='relative min-h-screen flex items-center justify-center overflow-hidden'
		>
			{/* ============================================
          BACKGROUND IMAGE
          EN: Fullscreen hero background with dark overlay
          UZ: To‘liq ekran fon rasmi + qora shaffof qatlam
      ============================================ */}
			<div
				className='absolute inset-0 bg-cover bg-center bg-no-repeat'
				style={{ backgroundImage: 'url("/349345-4k-wallpaper.jpg")' }}
			>
				<div className='absolute inset-0 bg-black/60'></div>
			</div>

			{/* ============================================
          MAIN CONTENT
          EN: Title, subtitle, buttons, stats
          UZ: Sarlavha, qo‘shimcha matn, tugmalar, statistika
      ============================================ */}
			<div className='relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto'>
				{/* Badge */}
				<div className='mb-8'>
					<span className='inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-medium mb-6'>
						<Star className='w-4 h-4 mr-2' />
						Premium Fashion Collection
					</span>
				</div>

				{/* Title */}
				<h1 className='text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
					Kelajakning
					<span className='block text-accent'>Modasi</span>
				</h1>

				{/* Subtitle */}
				<p className='text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
					Zamonaviy dizayn va premium sifat bilan yaratilgan noyob kiyimlar
					kolleksiyasi. Sizning uslubingizni yangi darajaga olib chiqing.
				</p>

				{/* ============================================
            CTA BUTTONS
            EN: Main action buttons (shop + about)
            UZ: Asosiy harakat tugmalari (xarid + biz haqimizda)
        ============================================ */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
					{/* View Collection */}
					<Link
						to='/products'
						className='inline-flex items-center px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
					>
						Kolleksiyani ko'rish
						<ArrowRight className='ml-2 w-5 h-5' />
					</Link>

					{/* About Section */}
					<Link
						to='/#about'
						className='inline-flex items-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition-all duration-200 hover:bg-white/10'
					>
						Biz haqimizda
					</Link>
				</div>

				{/* ============================================
            HERO STATS
            EN: Quick trust metrics (products, customers, etc.)
            UZ: Do‘kon statistikasi (mahsulotlar, mijozlar...)
        ============================================ */}
				<div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto'>
					<div className='text-center'>
						<div className='text-3xl font-bold text-white mb-2'>500+</div>
						<div className='text-gray-400 text-sm'>Mahsulotlar</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-white mb-2'>10k+</div>
						<div className='text-gray-400 text-sm'>Mamnun mijozlar</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-white mb-2'>50+</div>
						<div className='text-gray-400 text-sm'>Brendlar</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-white mb-2'>24/7</div>
						<div className='text-gray-400 text-sm'>Qo'llab-quvvatlash</div>
					</div>
				</div>
			</div>

			{/* ============================================
          SCROLL INDICATOR
          EN: Bounce animation encouraging scroll
          UZ: Pastga aylantirish uchun vizual ko‘rsatkich
      ============================================ */}
			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
				<div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
					<div className='w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse'></div>
				</div>
			</div>
		</section>
	)
}

export default Hero
