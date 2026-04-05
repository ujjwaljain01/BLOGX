import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Button, CommentForm, CommentList } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
	ChevronRight,
	Clock,
	Calendar,
	Edit,
	Trash2,
	ArrowLeft,
	List,
	Share2,
	Check,
	AlertCircle,
} from 'lucide-react';

export default function Post() {
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [copied, setCopied] = useState(false);

	const { slug } = useParams();
	const navigate = useNavigate();
	const userData = useSelector((state) => state.auth.userData);

	const isAuthor = post && userData ? post.userId === userData.$id : false;

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		if (!slug) {
			navigate('/');
			return;
		}
		(async () => {
			try {
				const res = await appwriteService.getPost(slug);
				if (!mounted) return;
				if (res) setPost(res);
				else navigate('/');
			} catch (e) {
				if (mounted) setError(e?.message || 'Failed to load post');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [slug, navigate]);

	const deletePost = async () => {
		try {
			const status = await appwriteService.deletePost(post.$id);
			if (status) {
				await appwriteService.deleteFile(post.featuredImage);
				navigate('/');
			}
		} catch (e) {
			setError(e?.message || 'Could not delete the post');
		}
	};

	const readingTime = useMemo(() => {
		if (!post?.content) return 0;
		const text = post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
		const words = text.trim().split(' ').filter(Boolean).length;
		return Math.max(1, Math.round(words / 200));
	}, [post?.content]);

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (_) {}
	};

	return (
		<div className=" min-h-screen w-full">
			<div className="md:max-w-[60%] mx-auto">
				{/* Breadcrumb */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="pt-6 flex items-center gap-2 text-sm text-[#6B7280]"
				>
					<Link
						to="/"
						className="hover:text-[#2563EB] transition-colors"
					>
						Home
					</Link>
					<ChevronRight className="w-4 h-4" />
					<span className="text-[#111827] font-medium">Post</span>
				</motion.div>

				{/* Error Message */}
				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3"
						>
							<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-sm text-red-800">{error}</p>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Loading Skeleton */}
				{loading ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-6"
					>
						<div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
							<div className="h-64 w-full rounded-lg bg-[#E5E7EB] animate-pulse" />
							<div className="mt-4 h-6 w-3/4 rounded bg-[#E5E7EB] animate-pulse" />
							<div className="mt-2 h-4 w-1/2 rounded bg-[#E5E7EB] animate-pulse" />
						</div>
						<aside className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 h-64 animate-pulse" />
					</motion.div>
				) : post ? (
					<div className="mt-6 gap-6">
						{/* Main Post Article */}
						<motion.article
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className=" overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
						>
							{/* Featured Image */}

							<div className="relative">
								{/* Author Actions */}
								{isAuthor && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className="absolute right-4 top-4 flex items-center gap-2"
									>
										<Link to={`/edit-post/${post.$id}`}>
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-lg hover:shadow-xl transition-shadow"
											>
												<Edit className="w-4 h-4" />
												Edit
											</motion.button>
										</Link>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => setShowConfirm(true)}
											className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all"
										>
											<Trash2 className="w-4 h-4" />
											Delete
										</motion.button>
									</motion.div>
								)}
							</div>

							{/* Post Content */}
							<div className="p-6 md:p-8">
								{/* Title */}
								<motion.h1
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
									className="text-2xl md:text-4xl font-bold tracking-tight text-[#111827] mr-[15%]"
								>
									{post.title}
								</motion.h1>

								{/* Meta Information */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
									className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]"
								>
									<div className="flex items-center gap-1.5">
										<Calendar className="w-4 h-4" />
										<span>
											{new Date(
												post.$createdAt,
											).toLocaleDateString()}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Clock className="w-4 h-4" />
										<span>{readingTime} min read</span>
									</div>
								</motion.div>

								<div class="w-full aspect-video bg-white flex items-center justify-center mt-6 mb-6">
									<img
										src={appwriteService.getFilePreview(
											post.featuredImage,
										)}
										alt={post.title}
										className="max-w-full max-h-fit object-contain"
									/>
								</div>

								{/* Post Content */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
									className="prose prose-slate max-w-none mt-6 text-[#111827] text-2xl text-justify"
								>
									{parse(post.content)}
								</motion.div>

								{/* Share Button */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="mt-8 pt-6 border-t border-[#E5E7EB]"
								>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={copyLink}
										className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-sm font-medium text-[#111827] hover:bg-white hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
									>
										{copied ? (
											<>
												<Check className="w-4 h-4 text-green-600" />
												<span className="text-green-600">
													Link copied!
												</span>
											</>
										) : (
											<>
												<Share2 className="w-4 h-4" />
												Share this post
											</>
										)}
									</motion.button>
								</motion.div>
							</div>
						</motion.article>

						{/* Sidebar */}
						{/* <motion.aside
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="space-y-6"
						>
							//Post Details Card
							<div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6">
								<h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wide">
									Post Details
								</h3>
								<dl className="mt-4 space-y-3 text-sm">
									<div>
										<dt className="text-[#6B7280]">
											Status
										</dt>
										<dd className="mt-1 capitalize font-medium text-[#111827]">
											{post.status}
										</dd>
									</div>
								</dl>

								// Navigation Buttons
								<div className="mt-6 space-y-2">
									<Link to="/" className="block">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors"
										>
											<ArrowLeft className="w-4 h-4" />
											Back to Home
										</motion.button>
									</Link>
									<Link to="/all-posts" className="block">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1d4ed8] transition-colors"
										>
											<List className="w-4 h-4" />
											All Posts
										</motion.button>
									</Link>
								</div>
							</div>
						</motion.aside> */}
					</div>
				) : null}
			</div>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{showConfirm && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4"
						onClick={() => setShowConfirm(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white shadow-2xl p-6"
						>
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
									<Trash2 className="w-5 h-5 text-red-600" />
								</div>
								<div className="flex-1">
									<h4 className="text-lg font-semibold text-[#111827]">
										Delete this post?
									</h4>
									<p className="mt-1 text-sm text-[#6B7280]">
										This action cannot be undone. The post
										will be permanently removed.
									</p>
								</div>
							</div>

							<div className="mt-6 flex items-center justify-end gap-3">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setShowConfirm(false)}
									className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors"
								>
									Cancel
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={deletePost}
									className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
								>
									Delete Post
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
