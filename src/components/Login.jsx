import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { login as authLogin } from '../store/authSlice';
import authService from '../appwrite/auth';

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError: setFormError,
		clearErrors,
	} = useForm({ mode: 'onBlur' });

	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const DEMO_CREDENTIALS = {
		email: 'hello@gmail.com',
		password: 'Hello@1750',
	};

	const handleDemoLogin = async () => {
		setError('');
		clearErrors('root');

		try {
			const session = await authService.login(DEMO_CREDENTIALS);
			if (session) {
				const userData = await authService.getCurrentUser();
				if (userData) dispatch(authLogin(userData));
				navigate('/');
			}
		} catch (err) {
			setError('Demo login failed. Please try again later.');
		}
	};

	const onSubmit = async (data) => {
		setError('');
		clearErrors('root');
		try {
			const session = await authService.login(data);
			if (session) {
				const userData = await authService.getCurrentUser();
				if (userData) dispatch(authLogin(userData));
				navigate('/');
			}
		} catch (err) {
			setError(err?.message || 'Failed to sign in');
			setFormError('root', {
				type: 'server',
				message: err?.message || 'Failed to sign in',
			});
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center p-6">
			<div className="relative w-full max-w-md">
				{/* Demo Box */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 border border-gray-200 rounded-xl p-5 shadow-sm"
				>
					<div className="flex items-center gap-2 mb-2">
						<Sparkles className="w-6 h-6 text-blue-600" />
						<h2 className="text-xl font-semibold text-gray-900">
							Demo Login
						</h2>
					</div>

					<p className="text-base text-gray-700 leading-relaxed">
						This is a skill-showcase project. Use the button below
						to explore the dashboard without creating an account.
					</p>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="button"
						onClick={handleDemoLogin}
						className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700"
					>
						Continue as Demo User
					</motion.button>

					<p className="mt-2 text-center text-sm text-gray-700">
						No signup required. Explore all features instantly.
					</p>
				</motion.div>

				{/* Login Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className=" border border-gray-200 shadow-lg rounded-xl p-8"
				>
					<div className="flex flex-col items-center gap-2 mb-6">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							Welcome back
						</h1>
						<p className="text-base text-gray-700">
							Sign in to your account to continue
						</p>
					</div>

					{/* Error */}
					{(error || errors.root?.message) && (
						<motion.div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
							<AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
							<p className="text-base text-red-800">
								{error || errors.root?.message}
							</p>
						</motion.div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Email */}
						<div>
							<label className="mb-2 block text-base font-medium text-gray-900">
								Email
							</label>

							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700" />

								<input
									type="email"
									placeholder="you@example.com"
									className="w-full rounded-lg bg-white border border-gray-200 pl-12 pr-4 py-3 text-lg text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('email')}
								/>
							</div>

							{errors.email && (
								<p className="mt-2 text-sm text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="text-base font-medium text-gray-900">
									Password
								</label>

								<Link className="text-sm text-blue-600 font-medium hover:underline">
									Forgot password?
								</Link>
							</div>

							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700" />

								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Enter your password"
									className="w-full rounded-lg bg-white border border-gray-200 pl-12 pr-12 py-3 text-lg text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('password')}
								/>

								<button
									type="button"
									onClick={() => setShowPassword((s) => !s)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
								>
									{showPassword ? (
										<EyeOff className="w-6 h-6" />
									) : (
										<Eye className="w-6 h-6" />
									)}
								</button>
							</div>

							{errors.password && (
								<p className="mt-2 text-sm text-red-600">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Remember */}
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								className="h-5 w-5 rounded border-gray-200 text-blue-600 focus:ring-blue-600/20"
								{...register('remember')}
							/>
							<label className="text-base text-gray-700">
								Remember me
							</label>
						</div>

						{/* Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-lg bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
						>
							{isSubmitting ? 'Signing in...' : 'Sign in'}
						</motion.button>
					</form>
				</motion.div>

				{/* Footer */}
				<p className="mt-6 text-center text-base text-gray-700">
					Don’t have an account?{' '}
					<Link className="font-semibold text-blue-600 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
