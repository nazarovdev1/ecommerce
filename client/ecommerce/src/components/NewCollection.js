import { Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductCard from './ProductCard'

const NewCollection = () => {
	const { getNewCollectionProducts, isLoading } = useProducts()

	if (isLoading)
		return (
			<div className='py-20 text-center'>
				<div className='animate-spin h-12 w-12 border-b-2 border-accent rounded-full mx-auto' />
			</div>
		)

	const products = getNewCollectionProducts()

	return (
		<section id='new-collection' className='py-20'>
			<div className='max-w-7xl mx-auto px-4'>
				<h2 className='text-4xl font-bold text-center text-white mb-10'>
					Yangi Kolleksiya
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{products.map(p => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>

				<div className='text-center mt-10'>
					<Link
						to='/products'
						className='bg-accent text-black px-6 py-3 rounded-lg'
					>
						Barcha mahsulotlar
					</Link>
				</div>
			</div>
		</section>
	)
}

export default NewCollection
