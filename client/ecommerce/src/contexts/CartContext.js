import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAuth } from './AuthContext'

// ======================================================
// CART REDUCER
// EN: Manages cart actions (add, update, remove etc.)
// UZ: Savat funksiyalari boshqaruvi (qo‘shish, o‘chirish va h.k.)
// ======================================================
const cartReducer = (state, action) => {
	switch (action.type) {
		// ----------------------------------------------------
		// LOAD CART
		// EN: Load saved cart from localStorage
		// UZ: Saqlangan savatni localStorage'dan yuklash
		// ----------------------------------------------------
		case 'LOAD_CART':
			return {
				...state,
				items: action.payload,
				totalItems: action.payload.reduce(
					(sum, item) => sum + item.quantity,
					0
				),
			}

		// ----------------------------------------------------
		// ADD TO CART
		// EN: Add new product or increase quantity if same item exists
		// UZ: Yangi mahsulot qo‘shish yoki mavjud bo‘lsa sonini oshirish
		// ----------------------------------------------------
		case 'ADD_TO_CART':
			const existingItemIndex = state.items.findIndex(
				item =>
					item.productId === action.payload.productId &&
					item.selectedColor === action.payload.selectedColor &&
					item.selectedSize === action.payload.selectedSize
			)

			let newItems

			if (existingItemIndex >= 0) {
				// EN: If same product, increase quantity
				// UZ: Bir xil mahsulot bo‘lsa, sonini oshiramiz
				newItems = [...state.items]
				newItems[existingItemIndex].quantity += action.payload.quantity
			} else {
				// EN: Otherwise add as new item
				// UZ: Aks holda yangi mahsulot sifatida qo‘shamiz
				newItems = [...state.items, action.payload]
			}

			// EN: Save updated cart to localStorage per user
			// UZ: Har bir user uchun alohida kartani localStorage'ga yozish
			localStorage.setItem(
				action.userId ? `cart_${action.userId}` : 'cart',
				JSON.stringify(newItems)
			)

			return {
				...state,
				items: newItems,
				totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
			}

		// ----------------------------------------------------
		// UPDATE QUANTITY
		// EN: Update item quantity (+ / -)
		// UZ: Mahsulot sonini o‘zgartirish (+ / -)
		// ----------------------------------------------------
		case 'UPDATE_QUANTITY':
			const updatedItems = state.items.map(item =>
				item.id === action.payload.id
					? { ...item, quantity: Math.max(1, action.payload.quantity) }
					: item
			)

			localStorage.setItem(
				action.userId ? `cart_${action.userId}` : 'cart',
				JSON.stringify(updatedItems)
			)

			return {
				...state,
				items: updatedItems,
				totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
			}

		// ----------------------------------------------------
		// REMOVE FROM CART
		// EN: Remove item from cart
		// UZ: Mahsulotni savatdan o‘chirish
		// ----------------------------------------------------
		case 'REMOVE_FROM_CART':
			const filteredItems = state.items.filter(
				item => item.id !== action.payload
			)

			localStorage.setItem(
				action.userId ? `cart_${action.userId}` : 'cart',
				JSON.stringify(filteredItems)
			)

			return {
				...state,
				items: filteredItems,
				totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
			}

		// ----------------------------------------------------
		// CLEAR CART
		// EN: Empty entire cart (logout or order complete)
		// UZ: Savatni tozalash (logout yoki buyurtma tugaganda)
		// ----------------------------------------------------
		case 'CLEAR_CART':
			localStorage.removeItem(action.userId ? `cart_${action.userId}` : 'cart')
			return { ...state, items: [], totalItems: 0 }

		default:
			return state
	}
}

const CartContext = createContext()

const initialState = {
	items: [],
	totalItems: 0,
}

export const CartProvider = ({ children }) => {
	const { user, isAuthenticated } = useAuth()
	const [state, dispatch] = useReducer(cartReducer, initialState)

	// ======================================================
	// LOAD CART ON USER CHANGE
	// EN: Load cart when app loads or when user logs in/out
	// UZ: Dastur ochilganda yoki user almashtirilganda savatni yuklash
	// ======================================================
	useEffect(() => {
		const cartKey = user ? `cart_${user.id}` : 'cart'
		const savedCart = localStorage.getItem(cartKey)

		if (savedCart) {
			try {
				const cartItems = JSON.parse(savedCart)
				dispatch({ type: 'LOAD_CART', payload: cartItems })
			} catch {
				localStorage.removeItem(cartKey)
			}
		} else {
			dispatch({ type: 'LOAD_CART', payload: [] })
		}
	}, [user])

	// ======================================================
	// ADD TO CART
	// EN: Create a cart item object and dispatch to reducer
	// UZ: Savat mahsulot obyektini yaratish va reducer'ga yuborish
	// ======================================================
	const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
		const cartItem = {
			id: Date.now().toString(), // EN: unique ID | UZ: noyob ID
			productId: product.id,
			name: product.name || product.title,
			category: product.category, // EN: Product category | UZ: Mahsulot kategoriyasi
			price: product.price,
			image: product.image || product.images?.[0] || '',
			badge: product.badge, // EN: Product badge | UZ: Mahsulot belgisi
			rating: product.rating, // EN: Product rating | UZ: Mahsulot reytingi
			description: product.description, // EN: Product description | UZ: Mahsulot tavsifi
			selectedColor,
			selectedSize,
			quantity,
			addedAt: new Date().toISOString(),
		}

		dispatch({ type: 'ADD_TO_CART', payload: cartItem, userId: user?.id })
	}

	// EN: Increase/decrease quantity
	// UZ: Mahsulot sonini oshirish/kamaytirish
	const updateQuantity = (itemId, quantity) => {
		dispatch({
			type: 'UPDATE_QUANTITY',
			payload: { id: itemId, quantity },
			userId: user?.id,
		})
	}

	// EN: Remove product completely
	// UZ: Mahsulotni butunlay o‘chirish
	const removeFromCart = itemId => {
		dispatch({ type: 'REMOVE_FROM_CART', payload: itemId, userId: user?.id })
	}

	// EN: Empty all cart items
	// UZ: Savatdagi hamma mahsulotni tozalash
	const clearCart = () => {
		dispatch({ type: 'CLEAR_CART', userId: user?.id })
	}

	// EN: Calculate total price
	// UZ: Savatdagi mahsulotlar umumiy narxi
	const getCartTotal = () => {
		return state.items.reduce((total, item) => {
			const price = typeof item.price === 'string'
				? parseFloat(item.price.replace('$', ''))
				: item.price
			return total + price * item.quantity
		}, 0)
	}

	return (
		<CartContext.Provider
			value={{
				items: state.items,
				totalItems: state.totalItems,
				addToCart,
				updateQuantity,
				removeFromCart,
				clearCart,
				getCartTotal,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

// EN: Hook to use cart context
// UZ: Savatdan foydalanish hook'i
export const useCart = () => {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}
