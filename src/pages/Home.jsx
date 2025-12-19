import React, { useEffect, useMemo, useState } from 'react';
import appwriteService from '../appwrite/config'; // your service instance (default export)
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';
import authService from '../appwrite/auth';
import conf from '../conf/conf.js';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [profile, setProfile] = useState(null); // user's profile doc
	const [loading, setLoading] = useState(true);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	const [activeCat, setActiveCat] = useState(null); // null = All, 'for-you' = personalized, otherwise categoryId

	// load categories
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

	// load posts and profile
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				// load posts (existing helper returns { documents: [...] } or false)
				const postsRes = await appwriteService.getPosts();
				const allPosts = postsRes?.documents || [];

				// try to load current user & profile (optional)
				let currentProfile = null;
				try {
					const user = await authService.getCurrentUser();
					if (user) {
						// attempt to fetch profile document with id = auth user id
						try {
							const prof =
								await appwriteService.database.getDocument(
									conf.appwriteDatabaseId,
									conf.appwriteProfileId,
									user.$id
								);
							currentProfile = prof;
						} catch (e) {
							// profile may not exist yet — that's okay
							currentProfile = null;
						}
					}
				} catch (e) {
					// no logged-in user
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

	// compute filtered posts by search + category/interests
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();

		// helper: check intersection of arrays
		const intersects = (arrA = [], arrB = []) => {
			if (!Array.isArray(arrA) || !Array.isArray(arrB)) return false;
			const s = new Set(arrA);
			return arrB.some((x) => s.has(x));
		};

		// base list after category/interests filtering
		let visible = posts;

		if (activeCat === 'for-you') {
			const interests = profile?.interests || [];
			if (interests.length) {
				visible = posts.filter((p) =>
					intersects(p?.category || [], interests)
				);
			} else {
				// if user has no interests, show all posts
				visible = posts;
			}
		} else if (activeCat) {
			// specific category selected
			visible = posts.filter(
				(p) =>
					Array.isArray(p?.category) && p.category.includes(activeCat)
			);
		} else {
			// activeCat === null -> All posts (no change)
			visible = posts;
		}

		// apply text search on top
		if (!q) return visible;

		return visible.filter((p) =>
			[p.title, p.slug, p.excerpt, p.content]
				.filter(Boolean)
				.some((t) => String(t).toLowerCase().includes(q))
		);
	}, [posts, query, activeCat, profile]);

	const handleCategoryClick = (catId) => {
		// toggle behavior: clicking same cat clears filter
		if (catId === 'for-you') {
			setActiveCat((prev) => (prev === 'for-you' ? null : 'for-you'));
		} else {
			setActiveCat((prev) => (prev === catId ? null : catId));
		}
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
			{/* Glow accents */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
			</div>

			<Container>
				{/* Hero */}
				<section className="relative z-10 pt-10 md:pt-14">
					<div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
						<div>
							<h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
								Latest Posts
							</h1>
							<p className="mt-2 text-white/70 max-w-2xl">
								Fresh stories, guides, and updates from the
								community.
							</p>
						</div>

						{/* Search */}
						<div className="w-full md:w-80">
							<label htmlFor="search" className="sr-only">
								Search posts
							</label>
							<input
								id="search"
								type="text"
								placeholder="Search posts…"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
							/>
						</div>
					</div>
				</section>

				{/* Category bar */}
				<section className="relative z-10 mt-6">
					<div className="flex items-center gap-3 overflow-x-auto pb-2">
						<button
							type="button"
							onClick={() => setActiveCat(null)}
							className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap ${
								activeCat === null
									? 'bg-indigo-600 text-white'
									: 'bg-white/5 text-white/80 border border-white/10'
							}`}
						>
							All
						</button>

						<button
							type="button"
							onClick={() => handleCategoryClick('for-you')}
							className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap ${
								activeCat === 'for-you'
									? 'bg-indigo-600 text-white'
									: 'bg-white/5 text-white/80 border border-white/10'
							}`}
							title="Personalized for you"
						>
							For You
						</button>

						{loadingCategories ? (
							<div className="flex gap-2 items-center">
								<div className="h-6 w-24 rounded-full bg-white/5 animate-pulse" />
							</div>
						) : (
							categories.map((cat) => (
								<button
									key={cat.$id}
									type="button"
									onClick={() => handleCategoryClick(cat.$id)}
									className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap ${
										activeCat === cat.$id
											? 'bg-indigo-600 text-white'
											: 'bg-white/5 text-white/80 border border-white/10'
									}`}
								>
									{cat.categoryName || cat.name || cat.slug}
								</button>
							))
						)}
					</div>
				</section>

				{/* Content */}
				<section className="relative z-10 py-8">
					{error && (
						<div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-200">
							{error}
						</div>
					)}

					{/* Loading skeleton */}
					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="rounded-2xl border border-white/10 bg-white/10 p-4 animate-pulse"
								>
									<div className="h-40 w-full rounded-xl bg-white/10" />
									<div className="mt-4 h-4 w-3/4 rounded bg-white/10" />
									<div className="mt-2 h-4 w-1/2 rounded bg-white/10" />
								</div>
							))}
						</div>
					) : filtered.length === 0 ? (
						// Empty state
						<div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-10 text-center">
							<h2 className="text-2xl font-semibold">
								No posts yet
							</h2>
							<p className="mt-2 text-white/70">
								{posts.length === 0
									? 'Login to read posts, or be the first to publish.'
									: activeCat === 'for-you'
									? 'No posts matched your interests yet. Try following more categories.'
									: 'No results matched your search.'}
							</p>
							<div className="mt-6 flex items-center justify-center gap-3">
								<Link
									to="/login"
									className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
								>
									Login
								</Link>
								<Link
									to="/add-post"
									className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"
								>
									Create a post
								</Link>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filtered.map((p) => (
								<div key={p.$id} className="min-h-full">
									<PostCard {...p} />
								</div>
							))}
						</div>
					)}
				</section>
			</Container>
		</div>
	);
}
