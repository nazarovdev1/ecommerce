import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import NewCollection from '../components/NewCollection'
import Bestsellers from '../components/Bestsellers'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const Home = () => {
	const location = useLocation()
	// EN: To read the current URL (including hash)
	// UZ: Joriy URL (hash bilan) olish uchun

	useEffect(() => {
		// EN: If URL contains #section, scroll to that section
		// UZ: URLda #bo‘lim bo‘lsa, shu joyga scroll qilish
		if (location.hash) {
			const element = document.getElementById(location.hash.substring(1))
			// EN: Remove "#" → find element by ID
			// UZ: "#" olib tashlab elementni ID bo‘yicha topish

			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					// EN: Smooth scroll to top of element
					// UZ: Elementning tepasigacha yumshoq scroll
				}, 100)
			}
		}
	}, [location])
	// EN: Run effect when URL changes
	// UZ: URL o‘zgarsa qayta bajariladi

	return (
		<div>
			<Hero />
			<NewCollection />
			<Bestsellers />
			<About />
			<Contact />
			<Footer />
		</div>
	)
}

export default Home
