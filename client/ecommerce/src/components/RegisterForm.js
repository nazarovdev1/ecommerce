import { AlertCircle, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RegisterForm = () => {
	// EN: Local form state for user data
	// UZ: Foydalanuvchi ma'lumotlarini saqlash uchun forma holati
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	// EN: Error messages for UI
	// UZ: UI uchun xatolik xabarlari
	const [error, setError] = useState('')

	// EN: Loading state during registration process
	// UZ: Ro'yxatdan o'tish vaqtida yuklanish holati
	const [isLoading, setIsLoading] = useState(false)

	// EN: Auth context's register function
	// UZ: AuthContext ichidagi register funksiyasi
	const { register } = useAuth()

	// EN: Navigate after successful registration
	// UZ: Ro'yxatdan o'tish muvaffaqiyatli bo'lsa — redirect qilish
	const navigate = useNavigate()

	// ========================== HANDLE SUBMIT =============================

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')

		// EN: Validate password match
		// UZ: Parollar mos kelayotganini tekshirish
		if (formData.password !== formData.confirmPassword) {
			setError('Parollar mos kelmaydi')
			return
		}

		// EN: Validate password length
		// UZ: Parol uzunligini tekshirish (kamida 6 belgidan iborat bo'lishi kerak)
		if (formData.password.length < 6) {
			setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
			return
		}

		setIsLoading(true)

		// EN: Register user via AuthContext
		// UZ: AuthContext orqali foydalanuvchini ro'yxatdan o'tkazish
		const result = register(
			formData.username,
			formData.email,
			formData.password
		)

		if (!result.success) {
			// EN: Display returned error
			// UZ: Qaytgan xatolikni ekranga chiqarish
			setError(result.error)
		} else {
			// EN: Redirect to login after successful registration
			// UZ: Muvaffaqiyatli ro'yxatdan o'tgandan so'ng login sahifasiga yo'naltirish
			navigate('/login')
		}

		setIsLoading(false)
	}

	// =========================== HANDLE INPUTS ============================

	const handleChange = e => {
		// EN: Update input field values
		// UZ: Input maydonlaridagi qiymatlarni yangilash
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	// =========================== UI STARTS ================================

	return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
			<div className='max-w-md w-full'>
				{/* ============ HEADER ============ */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4'>
						<User className='w-8 h-8 text-accent-foreground' />
					</div>
					<h1 className='text-3xl font-bold text-white mb-2'>
						Ro'yxatdan o'tish
					</h1>
					<p className='text-gray-400'>Yangi hisob yaratish</p>
				</div>

				{/* ============ REGISTER FORM ============ */}
				<div className='bg-gray-800 rounded-xl p-8 border border-gray-700'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* USERNAME */}
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Foydalanuvchi nomi
							</label>

							<div className='relative'>
								{/* Icon */}
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-gray-400' />
								</div>

								<input
									id='username'
									name='username'
									type='text'
									required
									value={formData.username}
									onChange={handleChange}
									className='block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
									placeholder='foydalanuvchi_nomi'
								/>
							</div>
						</div>

						{/* EMAIL */}
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Email
							</label>

							<div className='relative'>
								{/* Icon */}
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' />
								</div>

								<input
									id='email'
									name='email'
									type='email'
									required
									value={formData.email}
									onChange={handleChange}
									className='block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
									placeholder='sizning@email.com'
								/>
							</div>
						</div>

						{/* PASSWORD */}
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Parol
							</label>

							<div className='relative'>
								{/* Icon */}
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' />
								</div>

								<input
									id='password'
									name='password'
									type='password'
									required
									value={formData.password}
									onChange={handleChange}
									className='block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* CONFIRM PASSWORD */}
						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-300 mb-2'
							>
								Parolni tasdiqlash
							</label>

							<div className='relative'>
								{/* Icon */}
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' />
								</div>

								<input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className='block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
									placeholder='••••••••'
								/>
							</div>
						</div>

						{/* ERROR MESSAGE */}
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
							className='w-full flex justify-center items-center px-4 py-3 bg-accent hover:bg-accent/90 
                         text-accent-foreground font-semibold rounded-lg transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent 
                         disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isLoading ? (
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground'></div>
							) : (
								"Ro'yxatdan o'tish"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default RegisterForm
