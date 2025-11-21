import { Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
	const renderStars = rating => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < Math.floor(rating)
						? 'text-yellow-400 fill-current'
						: 'text-gray-400'
				}`}
			/>
		))
	}

	return (
		<div className='group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition'>
			<div className='relative'>
				<Link to={`/product/${product.id}`}>
					<img
						src={product.images?.[0]}
						alt={product.title}
						className='w-full h-64 object-cover group-hover:scale-110 transition'
					/>
				</Link>

				{product.status && (
					<span className='absolute top-4 left-4 bg-accent text-black px-3 py-1 rounded-full text-xs'>
						{product.status.toUpperCase()}
					</span>
				)}
			</div>

			<div className='p-6'>
				<span className='text-gray-400 text-sm'>{product.categoryId}</span>

				<Link to={`/product/${product.id}`}>
					<h3 className='text-white text-lg font-semibold line-clamp-2'>
						{product.title}
					</h3>
				</Link>

				<div className='flex items-center mt-2'>
					{renderStars(product.rating)}
					<span className='text-gray-400 text-sm ml-2'>({product.rating})</span>
				</div>

				<div className='flex items-center justify-between mt-4'>
					<span className='text-white text-xl font-bold'>${product.price}</span>

					{product.old_price && (
						<span className='text-gray-500 line-through text-sm'>
							${product.old_price}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProductCard
