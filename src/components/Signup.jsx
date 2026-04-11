import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	AlertCircle,
	Sparkles,
	CheckCircle,
	Shield,
} from 'lucide-react';
import { login as authLogin } from '../store/authSlice';
import authService from '../appwrite/auth';
import service from '../appwrite/config';
import conf from '../conf/conf.js';
import { Logo } from './index';

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
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [categories, setCategories] = useState([]);
	const [selectedInterests, setSelectedInterests] = useState([]);

	const passwordValue = watch('password', '');

	// Password strength calculation
	const strength = (() => {
		let score = 0;
		if (passwordValue.length >= 8) score++;
		if (/[A-Z]/.test(passwordValue)) score++;
		if (/[a-z]/.test(passwordValue)) score++;
		if (/\d/.test(passwordValue)) score++;
		if (/[@$!%*?&]/.test(passwordValue)) score++;
		return score;
	})();

	const getStrengthColor = () => {
		if (strength <= 1) return 'bg-red-500';
		if (strength === 2) return 'bg-orange-500';
		if (strength === 3) return 'bg-yellow-500';
		if (strength === 4) return 'bg-lime-500';
		return 'bg-green-500';
	};

	const getStrengthWidth = () => {
		return `${(strength / 5) * 100}%`;
	};

	// Fetch categories
	useEffect(() => {
		async function loadCategories() {
			try {
				const res = await service.getCategories();
				setCategories(res?.documents || []);
			} catch (err) {
				console.error('Failed to load categories', err);
			}
		}
		loadCategories();
	}, []);

	const toggleInterest = (id) => {
		setSelectedInterests((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const onSubmit = async (values) => {
		setError('');
		clearErrors('root');

		try {
			await authService.createAccount({
				name: values.name,
				email: values.email,
				password: values.password,
			});

			const current = await authService.getCurrentUser();
			if (!current) throw new Error('Failed to fetch created user');

			try {
				const userId = current.$id;
				const profileData = {
					userId,
					name: values.name || current.name || '',
					interests: selectedInterests,
					email: values.email || current.email || '',
				};

				await service.database.createDocument(
					conf.appwriteDatabaseId,
					conf.appwriteProfileId,
					userId,
					profileData,
				);
			} catch (profileErr) {
				console.warn('Profile creation failed', profileErr);
			}

			const freshUser = await authService.getCurrentUser();
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
		<div className="min-h-screen w-full flex items-center justify-center p-6 text-xs">
			<div className="relative w-full max-w-2xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="border border-gray-200 shadow-lg rounded-xl p-8"
				>
					{/* Header */}
					<div className="flex flex-col items-center gap-2 mb-6">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							Create your account
						</h1>
						<p className="text-xs text-gray-700">
							Start your journey in seconds
						</p>
					</div>

					{/* Error Alert */}
					{(error || errors.root?.message) && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3"
						>
							<AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
							<p className="text-xs text-red-800">
								{error || errors.root?.message}
							</p>
						</motion.div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Name */}
						<div>
							<label className="mb-2 block text-xs font-medium text-gray-900">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
								<input
									type="text"
									placeholder="Ujjwal Jain"
									className="w-full rounded-lg border border-gray-200 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('name', {
										required: 'Name is required',
									})}
								/>
							</div>
							{errors.name && (
								<p className="mt-2 text-xs text-red-600">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Email */}
						<div>
							<label className="mb-2 block text-xs font-medium text-gray-900">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
								<input
									type="email"
									placeholder="ujjwal.dev@gmail.com"
									className="w-full rounded-lg border border-gray-200 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('email', {
										required: 'Email is required',
									})}
								/>
							</div>
							{errors.email && (
								<p className="mt-2 text-xs text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="mb-2 block text-xs font-medium text-gray-900">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Create a strong password"
									className="w-full rounded-lg border border-gray-200 pl-11 pr-12 py-3 text-sm text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('password', {
										required: 'Password is required',
									})}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((s) => !s)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="mb-2 block text-xs font-medium text-gray-900">
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
								<input
									type={
										showConfirmPassword
											? 'text'
											: 'password'
									}
									placeholder="Re-type your password"
									className="w-full rounded-lg border border-gray-200 pl-11 pr-12 py-3 text-sm text-gray-900 placeholder-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
									{...register('confirm', {
										required: 'Confirm your password',
									})}
								/>
							</div>
						</div>

						{/* Interests */}
						<div>
							<label className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-900">
								<Sparkles className="w-4 h-4 text-blue-600" />
								Choose Your Interests
							</label>

							<div className="flex flex-wrap gap-2">
								{categories.map((cat) => (
									<button
										key={cat.$id}
										type="button"
										onClick={() => toggleInterest(cat.$id)}
										className={`px-4 py-2 rounded-lg border text-xs font-medium transition ${
											selectedInterests.includes(cat.$id)
												? 'bg-blue-600 text-white border-blue-600'
												: 'bg-white border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600'
										}`}
									>
										{cat.categoryName || cat.name}
									</button>
								))}
							</div>

							<p className="mt-2 text-xs text-gray-700">
								Select topics you're interested in.
							</p>
						</div>

						{/* Terms */}
						<div className="flex items-center  gap-3">
							<input
								type="checkbox"
								className="h-4 w-4 rounded border-gray-200 text-blue-600 focus:ring-blue-600/20"
								{...register('terms', {
									required: 'Accept terms',
								})}
							/>
							<label className="text-xs text-gray-700">
								I agree to the{' '}
								<Link
									to="/terms"
									className="text-blue-600 font-medium"
								>
									Terms
								</Link>{' '}
								and{' '}
								<Link
									to="/privacy"
									className="text-blue-600 font-medium"
								>
									Privacy Policy
								</Link>
							</label>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 "
						>
							{isSubmitting ? 'Creating...' : 'Create account'}
						</button>
					</form>
				</motion.div>

				{/* Footer */}
				<p className="mt-6 text-center text-xs text-gray-700">
					Already have an account?{' '}
					<Link to="/login" className="font-semibold text-blue-600">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;
