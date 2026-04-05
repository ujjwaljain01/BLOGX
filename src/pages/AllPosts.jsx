import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { Flame, TrendingUp, PlusCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TrendingPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		appwriteService.getPosts([]).then((res) => {
			if (res) {
				setPosts(res.documents);
			}
			setLoading(false);
		});
	}, []);

	// Animation Variants
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
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="w-full py-10 bg-gray-50 min-h-screen">
			<Container>
				{/* Header */}
				<div className="mb-10 text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Flame className="text-red-500" size={28} />
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
							Trending Posts
						</h1>
						<TrendingUp className="text-blue-500" size={28} />
					</div>
					<p className="text-gray-600 text-lg">
						Discover what’s hot and popular right now 🔥
					</p>
				</div>

				{/* Loading Skeleton */}
				{loading ? (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
					>
						{Array.from({ length: 8 }).map((_, i) => (
							<motion.div
								key={i}
								variants={itemVariants}
								className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
							>
								<div className="h-60 w-full rounded-lg bg-[#E5E7EB] animate-pulse" />
								<div className="mt-4 h-4 w-1/2 rounded bg-[#E5E7EB] animate-pulse" />
								<div className="mt-2 h-4 w-1/2 rounded bg-[#E5E7EB] animate-pulse" />
							</motion.div>
						))}
					</motion.div>
				) : posts.length === 0 ? (
					/* Empty State */
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4 }}
						className="mx-auto max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm"
					>
						<h2 className="text-2xl font-bold text-[#111827]">
							No trending posts yet
						</h2>
						<p className="mt-2 text-[#6B7280]">
							Login to explore posts or be the first to publish 🚀
						</p>

						<div className="mt-6 flex items-center justify-center gap-3">
							<Link
								to="/login"
								className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
							>
								<LogIn className="w-4 h-4" />
								Login
							</Link>

							<Link
								to="/add-post"
								className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB]"
							>
								<PlusCircle className="w-4 h-4" />
								Create Post
							</Link>
						</div>
					</motion.div>
				) : (
					/* Posts Grid */
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
					>
						{posts.map((post) => (
							<motion.div
								key={post.$id}
								variants={itemVariants}
								className="transition-transform duration-300 hover:scale-105"
							>
								<PostCard {...post} />
							</motion.div>
						))}
					</motion.div>
				)}
			</Container>
		</div>
	);
}
