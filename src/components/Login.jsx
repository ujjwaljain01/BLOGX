import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login as authLogin } from '../store/authSlice';
import authService from '../appwrite/auth';
import { Logo } from './index'; // keeping your Logo; swap/remove if needed

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
		<div className="min-h-screen w-full text-white flex items-center justify-center p-6">
			{/* Decorative gradient orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
			</div>

			<div className="relative w-full max-w-md">
				{/* Card */}
				<div className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-8">
					<div className="flex flex-col items-center gap-3">
						{/* <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
							<span className="inline-block w-12">
								<Logo width="100%" />
							</span>
						</div> */}
						<h1 className="text-2xl font-semibold tracking-tight">
							Welcome back
						</h1>
						<p className="text-sm text-white/70">
							Sign in to your account to continue
						</p>
					</div>

					{/* Alert */}
					{(error || errors.root?.message) && (
						<div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
							{error || errors.root?.message}
						</div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="mt-6 space-y-5"
					>
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="mb-2 block text-sm text-white/80"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="you@example.com"
								className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
										message: 'Enter a valid email',
									},
								})}
							/>
							{errors.email && (
								<p className="mt-2 text-xs text-red-300">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<label
									htmlFor="password"
									className="block text-sm text-white/80"
								>
									Password
								</label>
								<Link
									to="/forgot-password"
									className="text-xs text-indigo-300 hover:text-indigo-200"
								>
									Forgot password?
								</Link>
							</div>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Your secure password"
									className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-12 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
									{...register('password', {
										required: 'Password is required',
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
											message:
												'Use 8+ chars with upper/lower, number & symbol',
										},
									})}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((s) => !s)}
									className="absolute inset-y-0 right-0 my-1 mr-1 rounded-lg px-3 text-xs text-white/70 hover:text-white/90 bg-white/5 hover:bg-white/10"
									aria-label={
										showPassword
											? 'Hide password'
											: 'Show password'
									}
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
							{errors.password && (
								<p className="mt-2 text-xs text-red-300">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Remember me */}
						<div className="flex items-center gap-2">
							<input
								id="remember"
								type="checkbox"
								className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-400/40"
								{...register('remember')}
							/>
							<label
								htmlFor="remember"
								className="text-sm text-white/80"
							>
								Remember me
							</label>
						</div>

						{/* Submit button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="group relative w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
						>
							<span className="absolute inset-0 -z-10 rounded-xl bg-indigo-400/40 blur opacity-0 transition group-hover:opacity-100" />
							{isSubmitting ? 'Signing in…' : 'Sign in'}
						</button>

						{/* Divider */}
						<div className="relative my-1">
							<div
								className="absolute inset-0 flex items-center"
								aria-hidden="true"
							>
								<div className="w-full border-t border-white/10" />
							</div>
							<div className="relative flex justify-center">
								<span className="bg-transparent px-2 text-xs text-white/50">
									or
								</span>
							</div>
						</div>

						{/* OAuth placeholders (wire up later) */}
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
							>
								Sign in with Google
							</button>
							<button
								type="button"
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
							>
								Sign in with GitHub
							</button>
						</div>
					</form>
				</div>

				{/* Footer */}
				<p className="mt-6 text-center text-sm text-white/70">
					Don’t have an account?{' '}
					<Link
						to="/signup"
						className="font-medium text-indigo-300 hover:text-indigo-200"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
