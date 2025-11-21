import { useProducts } from '../contexts/ProductContext'
import ProductCard from './ProductCard'

const Bestsellers = () => {
	const { getBestsellerProducts, isLoading } = useProducts()

	if (isLoading)
		return (
			<div className='py-20 text-center'>
				<div className='animate-spin h-12 w-12 border-b-2 border-accent rounded-full mx-auto' />
			</div>
		)

	const products = getBestsellerProducts()

	return (
		<section id='bestsellers' className='py-20'>
			<div className='max-w-7xl mx-auto px-4'>
				<h2 className='text-4xl font-bold text-white text-center mb-10'>
					Bestsellerlar
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{products.map(p => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			</div>
		</section>
	)
}

export default Bestsellers
