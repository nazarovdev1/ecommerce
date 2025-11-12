import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Product reducer for optimized state management
const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        isLoading: false
      };
    case 'ADD_PRODUCT':
      const newProducts = [...state.products, action.payload];
      localStorage.setItem('admin_products', JSON.stringify(newProducts));
      // Notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      return {
        ...state,
        products: newProducts
      };
    case 'UPDATE_PRODUCT':
      const updatedProducts = state.products.map(product =>
        product.id === action.payload.id ? action.payload : product
      );
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      return {
        ...state,
        products: updatedProducts
      };
    case 'DELETE_PRODUCT':
      const filteredProducts = state.products.filter(product => product.id !== action.payload);
      localStorage.setItem('admin_products', JSON.stringify(filteredProducts));
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      return {
        ...state,
        products: filteredProducts
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const ProductContext = createContext();

const initialState = {
  products: [],
  isLoading: true
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Load default products
        const defaultProducts = await import('../data/products');
        let allProducts = [
          ...defaultProducts.newCollectionProducts,
          ...defaultProducts.bestsellerProducts
        ];

        // Load admin products from localStorage
        const storedProducts = localStorage.getItem('admin_products');
        if (storedProducts) {
          const adminProducts = JSON.parse(storedProducts);
          // Avoid duplicates
          const existingIds = allProducts.map(p => p.id);
          const uniqueAdminProducts = adminProducts.filter(p => !existingIds.includes(p.id));
          // Put admin products FIRST so they appear in New Collection
          allProducts = [...uniqueAdminProducts, ...allProducts];
        }

        dispatch({ type: 'SET_PRODUCTS', payload: allProducts });
      } catch (error) {
        console.error('Error loading products:', error);
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  // Optimized selectors using useMemo would be better, but for simplicity:
  const getProducts = () => state.products;

  const getNewCollectionProducts = () => state.products.slice(0, 4);

  const getBestsellerProducts = () => state.products.slice(4, 8);

  const getProduct = (id) => state.products.find(product => product.id === id);

  const addProduct = (productData) => {
    const newId = Math.max(...state.products.map(p => p.id), 0) + 1;
    const newProduct = { ...productData, id: newId };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (id, productData) => {
    const existingProduct = state.products.find(p => p.id === id);
    if (existingProduct) {
      const updatedProduct = { ...existingProduct, ...productData };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    }
  };

  const deleteProduct = (id) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  return (
    <ProductContext.Provider value={{
      products: state.products,
      isLoading: state.isLoading,
      getProducts,
      getNewCollectionProducts,
      getBestsellerProducts,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
