import React, { createContext, useContext, useState, useEffect } from 'react'

// EN: Simple demo password hashing (use real hashing on backend)
// UZ: Oddiy demo hashing (haqiqiy loyihada serverda kuchli hashing ishlatiladi)
const hashPassword = password => {
	let hash = 0
	for (let i = 0; i < password.length; i++) {
		const char = password.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash = hash & hash // EN: convert to 32-bit | UZ: 32-bitga o‘tkazish
	}
	return hash.toString()
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	// EN: User logged in or not
	// UZ: Foydalanuvchi kirganmi yoki yo‘q

	const [user, setUser] = useState(null)
	// EN: Logged in user info
	// UZ: Kirgan foydalanuvchi ma’lumoti

	const [isAdmin, setIsAdmin] = useState(false)
	// EN: Check if user is admin
	// UZ: Admin ekanligini aniqlash

	// EN: Hardcoded admin (should not be client-side in real apps)
	// UZ: Admin ma’lumotlari (haqiqiy loyihada clientda bo‘lmasligi kerak)
	const ADMIN_USERNAME = 'admin'
	const ADMIN_PASSWORD_HASH = hashPassword('admin123')

	// EN: Get user list from localStorage
	// UZ: localStorage’dan foydalanuvchilarni olish
	const getUsers = () => {
		const users = localStorage.getItem('users')
		return users ? JSON.parse(users) : []
	}

	// EN: Save users to localStorage
	// UZ: Foydalanuvchilarni localStorage'ga saqlash
	const saveUsers = users => {
		localStorage.setItem('users', JSON.stringify(users))
	}

	useEffect(() => {
		// EN: Auto-login admin if authenticated session exists
		// UZ: Avvaldan saqlangan admin session bo‘lsa avtomatik kirish
		const savedAdminAuth = localStorage.getItem('admin_auth')

		if (savedAdminAuth) {
			const authData = JSON.parse(savedAdminAuth)
			const now = Date.now()
			const ONE_DAY = 24 * 60 * 60 * 1000

			if (authData.isAuthenticated && now - authData.timestamp < ONE_DAY) {
				setIsAuthenticated(true)
				setUser({ username: authData.username, id: 'admin' })
				setIsAdmin(true)
				return // EN: Skip user check | UZ: User tekshirmaymiz
			} else {
				localStorage.removeItem('admin_auth')
			}
		}

		// EN: Auto-login normal user
		// UZ: Oddiy foydalanuvchini avtomatik login qilish
		const savedUserAuth = localStorage.getItem('user_auth')

		if (savedUserAuth) {
			const authData = JSON.parse(savedUserAuth)
			const now = Date.now()
			const ONE_DAY = 24 * 60 * 60 * 1000

			if (authData.isAuthenticated && now - authData.timestamp < ONE_DAY) {
				setIsAuthenticated(true)
				setUser(authData.user)
				setIsAdmin(false)
			} else {
				localStorage.removeItem('user_auth')
			}
		}
	}, [])

	// ============================
	// Registration
	// ============================
	const register = (username, email, password) => {
		const users = getUsers()

		// EN: Check duplicate username/email
		// UZ: Username/email takrorlanmasligini tekshirish
		if (users.find(u => u.username === username)) {
			return {
				success: false,
				error: 'Bu foydalanuvchi nomi allaqachon mavjud',
			}
		}

		if (users.find(u => u.email === email)) {
			return { success: false, error: "Bu email allaqachon ro'yxatdan o'tgan" }
		}

		// EN: Create new user
		// UZ: Yangi foydalanuvchi yaratish
		const newUser = {
			id: Date.now().toString(),
			username,
			email,
			passwordHash: hashPassword(password), // EN: store hashed | UZ: hashlangan ko‘rinishda saqlanadi
			createdAt: new Date().toISOString(),
		}

		users.push(newUser)
		saveUsers(users) // EN: Save to localStorage | UZ: localStorage'ga yozish

		return { success: true }
	}

	// ============================
	// Login
	// ============================
	const login = (username, password) => {
		// EN: Admin login check
		// UZ: Admin login tekshiruvi
		if (
			username === ADMIN_USERNAME &&
			hashPassword(password) === ADMIN_PASSWORD_HASH
		) {
			const authData = {
				isAuthenticated: true,
				user: { username, id: 'admin' },
				timestamp: Date.now(),
			}

			localStorage.setItem('admin_auth', JSON.stringify(authData))

			setIsAuthenticated(true)
			setUser({ username, id: 'admin' })
			setIsAdmin(true)

			return { success: true }
		}

		// EN: Check normal user
		// UZ: Oddiy foydalanuvchini tekshirish
		const users = getUsers()
		const foundUser = users.find(
			u => u.username === username && u.passwordHash === hashPassword(password)
		)

		if (foundUser) {
			const authData = {
				isAuthenticated: true,
				user: {
					id: foundUser.id,
					username: foundUser.username,
					email: foundUser.email,
				},
				timestamp: Date.now(),
			}

			localStorage.setItem('user_auth', JSON.stringify(authData))

			setIsAuthenticated(true)
			setUser(authData.user)
			setIsAdmin(false)

			return { success: true }
		}

		return { success: false, error: "Noto'g'ri login yoki parol" }
	}

	// ============================
	// Logout
	// ============================
	const logout = () => {
		// EN: Remove admin/user session
		// UZ: Admin yoki user sessionini o‘chirish
		if (isAdmin) {
			localStorage.removeItem('admin_auth')
		} else {
			localStorage.removeItem('user_auth')
		}

		setIsAuthenticated(false)
		setUser(null)
		setIsAdmin(false)
	}

	// Provide values to React context
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated, // EN: logged in? | UZ: tizimga kirganmi?
				user, // EN: user details | UZ: foydalanuvchi ma'lumoti
				isAdmin, // EN: admin status | UZ: adminmi?
				register, // EN: register function | UZ: ro‘yxatdan o‘tish funksiyasi
				login, // EN: login function | UZ: tizimga kirish funksiyasi
				logout, // EN: logout function | UZ: chiqish funksiyasi
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

// Hook for using AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext)

	// EN: Ensure hook used inside provider
	// UZ: Hook faqat AuthProvider ichida ishlashi uchun
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}
