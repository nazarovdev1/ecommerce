import { AlertCircle, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginForm = () => {
	// EN: Form input values
	// UZ: Forma qiymatlari
	const [credentials, setCredentials] = useState({ username: '', password: '' })

	// EN: Error message for failed login
	// UZ: Login xatosi uchun error xabari
	const [error, setError] = useState('')

	// EN: Loading state during login request
	// UZ: Login jarayoni davomida yuklanish holati
	const [isLoading, setIsLoading] = useState(false)

	const { login } = useAuth()
	const navigate = useNavigate()

	/* ======================================================
     HANDLE LOGIN SUBMIT
     EN: Validate + send login request
     UZ: Tekshirish + login funksiyasini ishga tushirish
  ====================================================== */
	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		const result = login(credentials.username, credentials.password)

		if (result.success) {
			navigate('/') // EN: Redirect user after login | UZ: Muvaffaqiyatli login → Bosh sahifa
		} else {
			setError(result.error)
		}

		setIsLoading(false)
	}

	// EN: Update input values
	// UZ: Input qiymatini yangilash
	const handleChange = e => {
		setCredentials({
			...credentials,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
			<div className='max-w-md w-full'>
				{/* ======================================================
            HEADER SECTION
            EN: Page title + icon
            UZ: Sarlavha va kichik ikonka
        ====================================================== */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4'>
						<Lock className='w-8 h-8 text-accent-foreground' />
					</div>
					<h1 className='text-3xl font-bold text-white mb-2'>Kirish</h1>
					<p className='text-gray-400'>
						Hisobingizga kirish uchun ma'lumotlarni kiriting
					</p>
				</div>

				{/* ======================================================
            LOGIN FORM WRAPPER
        ====================================================== */}
				<div className='bg-gray-800 rounded-xl p-8 border border-gray-700'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* USERNAME FIELD */}
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Foydalanuvchi nomi
							</label>
							<div className='relative'>
								<User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
								<input
									id='username'
									name='username'
									type='text'
									required
									value={credentials.username}
									onChange={handleChange}
									placeholder='admin'
									className='w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent'
								/>
							</div>
						</div>

						{/* PASSWORD FIELD */}
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Parol
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
								<input
									id='password'
									name='password'
									type='password'
									required
									value={credentials.password}
									onChange={handleChange}
									placeholder='••••••••'
									className='w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent'
								/>
							</div>
						</div>

						{/* ERROR MESSAGE (ONLY IF LOGIN FAILS) */}
						{error && (
							<div className='flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3'>
								<AlertCircle className='h-5 w-5 flex-shrink-0' />
								<span className='text-sm'>{error}</span>
							</div>
						)}

						{/* SUBMIT BUTTON */}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full flex justify-center items-center px-4 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition duration-200 disabled:opacity-50'
						>
							{isLoading ? (
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground'></div>
							) : (
								'Kirish'
							)}
						</button>
					</form>

					{/* REGISTER LINK */}
					<div className='mt-6 text-center'>
						<p className='text-sm text-gray-400'>
							Hisobingiz yo'qmi?{' '}
							<Link
								to='/register'
								className='text-accent hover:text-accent/80 font-medium'
							>
								Ro'yxatdan o'tish
							</Link>
						</p>
					</div>

					{/* DEMO DATA */}
					<div className='mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600'>
						<p className='text-sm text-gray-400 mb-2'>Demo ma'lumotlar:</p>
						<p className='text-xs text-gray-500'>
							Login: <span className='text-accent'>admin</span>
							<br />
							Parol: <span className='text-accent'>admin123</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginForm
