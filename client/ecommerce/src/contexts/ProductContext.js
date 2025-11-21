// ProductContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import useProductService from '../server/server'
import { newCollectionProducts, bestsellerProducts } from '../data/products'

// Initial state
const initialState = {
	products: [],
	isLoading: true,
}

// Reducer
const productReducer = (state, action) => {
	switch (action.type) {
		case 'SET_PRODUCTS':
			return { ...state, products: action.payload, isLoading: false }

		default:
			return state
	}
}

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
	const [state, dispatch] = useReducer(productReducer, initialState)
	const { 
		getAllProducts, 
		getDetailedProduct,
		getRelatedProduct,
		postProduct, 
		deleteProduct, 
		putProduct 
	} = useProductService()

	// LOAD PRODUCTS FROM BACKEND
	useEffect(() => {
		const load = async () => {
			dispatch({ type: 'SET_PRODUCTS', payload: [] })

			const backendProducts = await getAllProducts()

			if (backendProducts.length === 0) {
				// Fallback to static products if backend returns empty
				const allStaticProducts = [...newCollectionProducts, ...bestsellerProducts]
				dispatch({ type: 'SET_PRODUCTS', payload: allStaticProducts })
			} else {
				dispatch({ type: 'SET_PRODUCTS', payload: backendProducts })
			}
		}

		load()
	}, [])

	// SELECTORS
	const getProducts = () => state.products

	const getNewCollectionProducts = () =>
		state.products
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 4)

	const getBestsellerProducts = () =>
		state.products
			.sort((a, b) => a.price - b.price)
			.slice(0, 4)

	const getProduct = id => state.products.find(p => p.id === id)

	// CRUD OPERATIONS
	const addProduct = async (productData) => {
		const newProduct = await postProduct(productData)
		if (newProduct) {
			dispatch({ type: 'SET_PRODUCTS', payload: [...state.products, newProduct] })
		}
		return newProduct
	}

	const updateProduct = async (id, productData) => {
		const updated = await putProduct(id, productData)
		if (updated) {
			const updatedProducts = state.products.map(p => 
				p.id === id ? updated : p
			)
			dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts })
		}
		return updated
	}

	const removeProduct = async (id) => {
		const success = await deleteProduct(id)
		if (success) {
			const filtered = state.products.filter(p => p.id !== id)
			dispatch({ type: 'SET_PRODUCTS', payload: filtered })
		}
		return success
	}

	return (
		<ProductContext.Provider
			value={{
				products: state.products,
				isLoading: state.isLoading,
				getProducts,
				getNewCollectionProducts,
				getBestsellerProducts,
				getProduct,
				getDetailedProduct,
				getRelatedProduct,
				addProduct,
				updateProduct,
				removeProduct,
			}}
		>
			{children}
		</ProductContext.Provider>
	)
}

export const useProducts = () => useContext(ProductContext)
