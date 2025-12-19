import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login as authLogin } from '../store/authSlice';
import authService from '../appwrite/auth'; // existing wrapper for Account auth
import service from '../appwrite/config'; // <- your Service default export
import conf from '../conf/conf.js'; // read DB & collection ids from conf
import { Logo } from './index'; // keep your existing Logo component

function Signup() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		setError: setFormError,
		clearErrors,
		watch,
		formState: { errors, isSubmitting },
	} = useForm({ mode: 'onBlur' });

	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// categories & selected interests
	const [categories, setCategories] = useState([]);
	const [selectedInterests, setSelectedInterests] = useState([]);

	const passwordValue = watch('password', '');

	// password strength calc
	const strength = (() => {
		let score = 0;
		if (passwordValue.length >= 8) score++;
		if (/[A-Z]/.test(passwordValue)) score++;
		if (/[a-z]/.test(passwordValue)) score++;
		if (/\d/.test(passwordValue)) score++;
		if (/[@$!%*?&]/.test(passwordValue)) score++;
		return score; // 0..5
	})();

	// fetch categories on mount using service.getCategories()
	useEffect(() => {
		async function loadCategories() {
			try {
				const res = await service.getCategories(); // returns { documents: [...] }
				setCategories(res?.documents || []);
			} catch (err) {
				console.error('Failed to load categories', err);
			}
		}
		loadCategories();
	}, []);

	const toggleInterest = (id) => {
		setSelectedInterests((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const onSubmit = async (values) => {
		setError('');
		clearErrors('root');

		try {
			// 1) create account (authService existing wrapper)
			await authService.createAccount({
				name: values.name,
				email: values.email,
				password: values.password,
			});

			// 2) get current user (Auth)
			const current = await authService.getCurrentUser();
			if (!current) throw new Error('Failed to fetch created user');

			// 3) create a Profile document linked to Auth userId
			try {
				const userId = current.$id;
				const profileData = {
					userId,
					name: values.name || current.name || '',
					interests: selectedInterests, // array of category $id strings
					email: values.email || current.email || '',
				};

				// Use your service.database.createDocument (Appwrite SDK)
				// Conf has db & profile collection ids
				await service.database.createDocument(
					conf.appwriteDatabaseId,
					conf.appwriteProfileId, // ensure this key exists in conf.js
					userId, // document id = auth user id
					profileData
				);
			} catch (profileErr) {
				// non-blocking: profile creation error shouldn't break login, but show warning
				console.warn('Profile creation failed', profileErr);
			}

			// 4) dispatch login to redux and navigate
			const freshUser = await authService.getCurrentUser(); // refresh to be safe
			dispatch(authLogin(freshUser));
			navigate('/');
		} catch (err) {
			const message = err?.message || 'Failed to create account';
			setError(message);
			setFormError('root', { type: 'server', message });
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen w-full text-white flex items-center justify-center p-6">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
			</div>

			<div className="relative w-full max-w-md">
				<div className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-8">
					<div className="flex flex-col items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create your account
						</h1>
						<p className="text-sm text-white/70">
							Start your journey in seconds
						</p>
					</div>

					{(error || errors.root?.message) && (
						<div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
							{error || errors.root?.message}
						</div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="mt-6 space-y-5"
					>
						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="mb-2 block text-sm text-white/80"
							>
								Name
							</label>
							<input
								id="name"
								type="text"
								placeholder="Your full name"
								className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
								{...register('name', {
									required: 'Name is required',
								})}
							/>
							{errors.name && (
								<p className="mt-2 text-xs text-red-300">
									{errors.name.message}
								</p>
							)}
						</div>

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
							<label
								htmlFor="password"
								className="mb-2 block text-sm text-white/80"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Create a strong password"
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

							{/* Strength meter */}
							<div className="mt-3">
								<div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-300 ${
											strength <= 1
												? 'w-1/5 bg-red-400'
												: strength === 2
												? 'w-2/5 bg-orange-400'
												: strength === 3
												? 'w-3/5 bg-yellow-400'
												: strength === 4
												? 'w-4/5 bg-lime-400'
												: 'w-full bg-emerald-400'
										}`}
									/>
								</div>
								<p className="mt-1 text-[11px] text-white/60">
									{strength <= 2
										? 'Weak — add numbers, symbols & mix case'
										: strength === 3
										? 'Okay — could be stronger'
										: strength === 4
										? 'Strong'
										: 'Very strong'}
								</p>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label
								htmlFor="confirm"
								className="mb-2 block text-sm text-white/80"
							>
								Confirm password
							</label>
							<input
								id="confirm"
								type={showPassword ? 'text' : 'password'}
								placeholder="Re-type password"
								className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
								{...register('confirm', {
									required: 'Please confirm your password',
									validate: (val) =>
										val === passwordValue ||
										'Passwords do not match',
								})}
							/>
							{errors.confirm && (
								<p className="mt-2 text-xs text-red-300">
									{errors.confirm.message}
								</p>
							)}
						</div>

						{/* Interests multi-select */}
						<div>
							<label className="mb-2 block text-sm text-white/80">
								Choose your interests
							</label>
							<div className="flex flex-wrap gap-2">
								{categories.map((cat) => (
									<button
										type="button"
										key={cat.$id}
										onClick={() => toggleInterest(cat.$id)}
										className={`px-3 py-1 rounded-full border transition text-sm ${
											selectedInterests.includes(cat.$id)
												? 'bg-indigo-600 text-white border-indigo-600'
												: 'bg-white/5 border-white/10 text-white/80'
										}`}
									>
										{cat.categoryName ||
											cat.name ||
											cat.title ||
											cat.slug}
									</button>
								))}
							</div>
							<p className="mt-2 text-xs text-white/60">
								You can select multiple interests; you can edit
								these later in your profile.
							</p>
						</div>

						{/* Terms */}
						<div className="flex items-start gap-3">
							<input
								id="terms"
								type="checkbox"
								className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-400/40"
								{...register('terms', {
									required: 'Please accept the terms',
								})}
							/>
							<label
								htmlFor="terms"
								className="text-sm text-white/80"
							>
								I agree to the{' '}
								<Link
									to="/terms"
									className="text-indigo-300 hover:text-indigo-200"
								>
									Terms
								</Link>{' '}
								and{' '}
								<Link
									to="/privacy"
									className="text-indigo-300 hover:text-indigo-200"
								>
									Privacy Policy
								</Link>
								.
							</label>
						</div>
						{errors.terms && (
							<p className="-mt-2 text-xs text-red-300">
								{errors.terms.message}
							</p>
						)}

						{/* CTA */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="group relative w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
						>
							<span className="absolute inset-0 -z-10 rounded-xl bg-indigo-400/40 blur opacity-0 transition group-hover:opacity-100" />
							{isSubmitting
								? 'Creating account…'
								: 'Create account'}
						</button>

						{/* Divider */}
						<div className="relative my-1">
							<div
								className="absolute inset-0 flex items-center"
								aria-hidden="true"
							>
								<div className="w-full border-t border-white/10" />
							</div>
							{/* <div className="relative flex justify-center">
								<span className="bg-transparent px-2 text-xs text-white/50">
									or
								</span>
							</div> */}
						</div>

						{/* OAuth placeholders */}
						{/* <div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
							>
								Sign up with Google
							</button>
							<button
								type="button"
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
							>
								Sign up with GitHub
							</button>
						</div> */}
					</form>
				</div>

				<p className="mt-6 text-center text-sm text-white/70">
					Already have an account?{' '}
					<Link
						to="/login"
						className="font-medium text-indigo-300 hover:text-indigo-200"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;
