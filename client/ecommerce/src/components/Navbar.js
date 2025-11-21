import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Navbar = ({ onSearchClick, onCartClick }) => {
	// EN: Navbar state for mobile menu & user menu
	// UZ: Mobil menyu va user menyu holati
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

	// EN: Auth & cart data
	// UZ: Auth va savat ma'lumotlari
	const { isAuthenticated, isAdmin, user, logout } = useAuth()
	const { totalItems } = useCart()

	const location = useLocation()
	const navigate = useNavigate()
	const userMenuRef = useRef(null)

	// EN: Toggle mobile menu
	// UZ: Mobil menyuni yoqish/o‘chirish
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

	/* =============================================================
     SMOOTH SCROLL TO HOME SECTIONS
     EN: If user is not on "/", first navigate, then scroll.
     UZ: Agar foydalanuvchi bosh sahifada bo‘lmasa → avval navigate,
         keyin scroll bo‘ladi.
  ============================================================= */
	const scrollToSection = sectionId => {
		if (location.pathname !== '/') {
			navigate(`/#${sectionId}`)
			return
		}
		const element = document.getElementById(sectionId)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	const handleNavClick = (e, sectionId) => {
		e.preventDefault()
		scrollToSection(sectionId)
		setIsMenuOpen(false) // close mobile
	}

	/* =============================================================
     CLOSE USER MENU WHEN CLICKING OUTSIDE  
     EN: Detect outside click
     UZ: Tashqariga bosilganda menyuni yopish
  ============================================================= */
	useEffect(() => {
		const handleClickOutside = event => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
				setIsUserMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const navItems = [
		{ name: 'Bosh sahifa', sectionId: 'hero' },
		{ name: 'Yangi kolleksiya', sectionId: 'new-collection' },
		{ name: 'Bestsellerlar', sectionId: 'bestsellers' },
		{ name: 'Biz haqimizda', sectionId: 'about' },
		{ name: 'Aloqa', sectionId: 'contact' },
	]

	return (
		<nav
			className='bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50'
			style={{ backdropFilter: 'blur(10px)' }}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* =============================================================
            NAVBAR MAIN WRAPPER (logo + nav + actions)
        ============================================================= */}
				<div className='flex justify-between items-center h-16'>
					{/* LOGO */}
					<Link to='/' className='flex items-center space-x-2'>
						{/* EN: Gradient brand name
               UZ: Gradientli brend nomi */}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 font-bold text-2xl'>
							LUXE
						</span>
					</Link>

					{/* DESKTOP NAVIGATION */}
					<div className='hidden md:flex items-center space-x-8'>
						{navItems.map(item => (
							<button
								key={item.name}
								onClick={e => handleNavClick(e, item.sectionId)}
								className='text-gray-300 hover:text-white transition font-medium'
							>
								{item.name}
							</button>
						))}
					</div>

					{/* =============================================================
              RIGHT-SIDE ACTION BUTTONS (Search, Cart, User)
          ============================================================= */}
					<div className='flex items-center space-x-4 lg:space-x-7'>
						{/* SEARCH BUTTON */}
						<button
							onClick={onSearchClick}
							className='text-gray-400 hover:text-white'
						>
							<Search className='h-5 w-5' />
						</button>

						{/* CART BUTTON */}
						<button
							onClick={onCartClick}
							className='text-gray-400 hover:text-white relative'
						>
							<ShoppingCart className='h-5 w-5' />

							{/* EN: Show cart item badge  
                 UZ: Savatdagi sonni ko‘rsatish */}
							{totalItems > 0 && (
								<span className='absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
									{totalItems > 9 ? '9+' : totalItems}
								</span>
							)}
						</button>

						{/* =============================================================
                USER MENU (Logged in / Guest)
            ============================================================= */}
						{isAuthenticated ? (
							<div className='relative pt-1.5' ref={userMenuRef}>
								<button
									onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
									className='text-gray-400 hover:text-white'
								>
									<User className='h-5 w-5' />
								</button>

								{/* USER DROPDOWN */}
								{isUserMenuOpen && (
									<div className='absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1'>
										{/* EN: Only admin sees admin panel
                       UZ: Admin bo‘lsa admin panel ko‘rinadi */}
										{isAdmin && (
											<Link
												to='/admin'
												className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
												onClick={() => setIsUserMenuOpen(false)}
											>
												Admin panel
											</Link>
										)}

										<div className='px-4 py-2 text-sm text-gray-400 border-t border-gray-700'>
											Salom, {user?.username}
										</div>

										{/* LOGOUT */}
										<button
											onClick={() => {
												logout()
												setIsUserMenuOpen(false)
											}}
											className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
										>
											Chiqish
										</button>
									</div>
								)}
							</div>
						) : (
							/* GUEST USER DROPDOWN */
							<div className='relative' ref={userMenuRef}>
								<button
									onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
									className='text-gray-400 hover:text-white'
								>
									<User className='h-5 w-5' />
								</button>

								{isUserMenuOpen && (
									<div className='absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1'>
										<Link
											to='/login'
											className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
											onClick={() => setIsUserMenuOpen(false)}
										>
											Kirish
										</Link>
										<Link
											to='/register'
											className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700'
											onClick={() => setIsUserMenuOpen(false)}
										>
											Ro'yxatdan o'tish
										</Link>
									</div>
								)}
							</div>
						)}

						{/* MOBILE MENU BUTTON */}
						<button
							onClick={toggleMenu}
							className='md:hidden text-gray-400 hover:text-white'
						>
							{isMenuOpen ? (
								<X className='h-6 w-6' />
							) : (
								<Menu className='h-6 w-6' />
							)}
						</button>
					</div>
				</div>

				{/* =============================================================
            MOBILE NAVIGATION
        ============================================================= */}
				{isMenuOpen && (
					<div className='md:hidden'>
						<div className='px-2 pt-2 pb-3 bg-gray-800 rounded-md mt-2'>
							{navItems.map(item => (
								<button
									key={item.name}
									onClick={e => handleNavClick(e, item.sectionId)}
									className='block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md'
								>
									{item.name}
								</button>
							))}

							{/* AUTH OPTIONS FOR MOBILE */}
							{isAuthenticated ? (
								<>
									{isAdmin && (
										<Link
											to='/admin'
											className='block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md'
											onClick={() => setIsMenuOpen(false)}
										>
											Admin panel
										</Link>
									)}
									<div className='px-3 py-2 text-sm text-gray-400'>
										Salom, {user?.username}
									</div>
									<button
										onClick={() => {
											logout()
											setIsMenuOpen(false)
										}}
										className='block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md'
									>
										Chiqish
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										className='block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md'
										onClick={() => setIsMenuOpen(false)}
									>
										Kirish
									</Link>
									<Link
										to='/register'
										className='block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md'
										onClick={() => setIsMenuOpen(false)}
									>
										Ro'yxatdan o'tish
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar
