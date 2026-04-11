import React, { useEffect, useMemo, useState } from 'react';
import appwriteService from '../appwrite/config';
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';
import authService from '../appwrite/auth';
import conf from '../conf/conf.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Search,
	Sparkles,
	AlertCircle,
	PlusCircle,
	LogIn,
	Clock,
} from 'lucide-react';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [activeCat, setActiveCat] = useState(null);

	// Load categories
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoadingCategories(true);
				const res = await appwriteService.getCategories();
				if (!mounted) return;
				setCategories(res?.documents || []);
			} catch (e) {
				console.error('Failed to load categories', e);
			} finally {
				if (mounted) setLoadingCategories(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	// Load posts and profile
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const postsRes = await appwriteService.getPosts();
				const allPosts = postsRes?.documents || [];
				console.log(allPosts);

				let currentProfile = null;
				try {
					const user = await authService.getCurrentUser();
					console.log(user);
					if (user) {
						try {
							const prof =
								await appwriteService.database.getDocument(
									conf.appwriteDatabaseId,
									conf.appwriteProfileId,
									user.$id,
								);
							currentProfile = prof;
						} catch (e) {
							currentProfile = null;
						}
					}
				} catch (e) {
					currentProfile = null;
				}

				if (!mounted) return;
				setPosts(allPosts);
				setProfile(currentProfile);
			} catch (e) {
				if (mounted) setError(e?.message || 'Failed to load posts');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	// Compute filtered posts
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();

		const intersects = (arrA = [], arrB = []) => {
			if (!Array.isArray(arrA) || !Array.isArray(arrB)) return false;
			const s = new Set(arrA);
			return arrB.some((x) => s.has(x));
		};

		let visible = posts;

		if (activeCat === 'for-you') {
			const interests = profile?.interests || [];
			if (interests.length) {
				visible = posts.filter((p) =>
					intersects(p?.category || [], interests),
				);
			} else {
				visible = posts;
			}
		} else if (activeCat) {
			visible = posts.filter(
				(p) =>
					Array.isArray(p?.category) &&
					p.category.includes(activeCat),
			);
		} else {
			visible = posts;
		}

		if (!q) return visible;

		return visible.filter((p) =>
			[p.title, p.slug, p.excerpt, p.content]
				.filter(Boolean)
				.some((t) => String(t).toLowerCase().includes(q)),
		);
	}, [posts, query, activeCat, profile]);

	const handleCategoryClick = (catId) => {
		if (catId === 'for-you') {
			setActiveCat((prev) => (prev === 'for-you' ? null : 'for-you'));
		} else {
			setActiveCat((prev) => (prev === catId ? null : catId));
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	return (
		<div className="min-h-screen w-full">
			<Container>
				{/* Hero Section */}
				<motion.section
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="pt-10 md:pt-14"
				>
					<div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
						<div className=" animate-fade-in">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="text-blue-600" size={28} />
								<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
									Latest Posts
								</h1>
							</div>

							<p className="text-gray-600 text-lg max-w-2xl">
								Fresh stories, guides, and updates from the
								community 🚀
							</p>
						</div>

						{/* Search Bar */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="w-full md:w-80"
						>
							<label htmlFor="search" className="sr-only text-xs">
								Search posts
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
								<input
									id="search"
									type="text"
									placeholder="Search posts…"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="w-full rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] pl-11 pr-4 py-3 text-[#111827] placeholder-[#6B7280] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
								/>
							</div>
						</motion.div>
					</div>
				</motion.section>

				{/* Category Filter Bar */}
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="mt-8"
				>
					<div className="flex items-center gap-2 overflow-x-auto p-2 scrollbar-hide">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => setActiveCat(null)}
							className={`px-4 py-2 rounded-lg text-xs transition whitespace-nowrap ${
								activeCat === null
									? 'bg-[#2563EB] text-white shadow-md'
									: 'bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:border-[#2563EB] hover:text-[#2563EB]'
							}`}
						>
							All
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => handleCategoryClick('for-you')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
								activeCat === 'for-you'
									? 'bg-[#2563EB] text-white shadow-md'
									: 'bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:border-[#2563EB] hover:text-[#2563EB]'
							}`}
							title="Personalized for you"
						>
							<Sparkles className="w-4 h-4" />
							For You
						</motion.button>
					</div>
				</motion.section>

				{/* Content Section */}
				<section className="py-8">
					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3"
						>
							<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-sm text-red-800">{error}</p>
						</motion.div>
					)}

					{/* Loading Skeleton */}
					{loading ? (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{Array.from({ length: 8 }).map((_, i) => (
								<motion.div
									key={i}
									variants={itemVariants}
									className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4"
								>
									<div className="h-40 w-full rounded-lg bg-[#E5E7EB] animate-pulse" />
									<div className="mt-4 h-4 w-3/4 rounded bg-[#E5E7EB] animate-pulse" />
									<div className="mt-2 h-4 w-1/2 rounded bg-[#E5E7EB] animate-pulse" />
								</motion.div>
							))}
						</motion.div>
					) : filtered.length === 0 ? (
						// Empty State
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="mx-auto max-w-2xl rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center"
						>
							<h2 className="text-xl font-bold text-[#111827]">
								No posts yet
							</h2>
							<p className="mt-2 text-sm text-[#6B7280]">
								{posts.length === 0
									? 'Login to read posts, or be the first to publish.'
									: activeCat === 'for-you'
										? 'No posts matched your interests yet. Try following more categories.'
										: 'No results matched your search.'}
							</p>
							<div className="mt-6 flex items-center justify-center gap-3">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{posts.length === 0 && (
										<Link
											to="/login"
											className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
										>
											<LogIn className="w-4 h-4" />
											Login
										</Link>
									)}
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Link
										to="/add-post"
										className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
									>
										<PlusCircle className="w-4 h-4" />
										Create a post
									</Link>
								</motion.div>
							</div>
						</motion.div>
					) : (
						// Posts Grid
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							<AnimatePresence>
								{filtered.map((p, index) => (
									<motion.div
										key={p.$id}
										variants={itemVariants}
										initial="hidden"
										animate="visible"
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ delay: index * 0.05 }}
										className="min-h-full"
									>
										<PostCard {...p} />
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					)}
				</section>
			</Container>
		</div>
	);
}
