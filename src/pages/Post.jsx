import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Button, Container, CommentForm, CommentList } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

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
		<div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
			{/* BG glow */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
			</div>

			<Container>
				{/* Breadcrumb */}
				<div className="relative z-10 pt-6 text-sm text-white/60">
					<Link to="/" className="hover:text-white">
						Home
					</Link>
					<span className="mx-2">/</span>
					<span className="text-white/80">Post</span>
				</div>

				{/* Errors */}
				{error && (
					<div className="relative z-10 mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-200">
						{error}
					</div>
				)}

				{/* Loading */}
				{loading ? (
					<div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-3">
						<div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 animate-pulse">
							<div className="h-64 w-full rounded-xl bg-white/10" />
						</div>
						<aside className="rounded-2xl border border-white/10 bg-white/10 p-4 animate-pulse" />
					</div>
				) : post ? (
					<div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-3">
						{/* Main post */}
						<article className="lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
							{/* Image */}
							<div className="relative">
								<img
									src={appwriteService.getFilePreview(
										post.featuredImage
									)}
									alt={post.title}
									className="h-72 w-full object-cover sm:h-96"
								/>
								{isAuthor && (
									<div className="absolute right-4 top-4 flex items-center gap-2">
										<Link to={`/edit-post/${post.$id}`}>
											<Button
												bgColor="bg-green-500"
												className="!py-2 !px-3 !text-sm"
											>
												Edit
											</Button>
										</Link>
										<Button
											bgColor="bg-red-500"
											className="!py-2 !px-3 !text-sm"
											onClick={() => setShowConfirm(true)}
										>
											Delete
										</Button>
									</div>
								)}
							</div>

							{/* Header */}
							<div className="p-6">
								<h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
									{post.title}
								</h1>

								{/* Meta */}
								<div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/70">
									<span>
										{new Date(
											post.$createdAt
										).toLocaleDateString()}
									</span>
									<span>• {readingTime} min read</span>
								</div>

								{/* Content */}
								<div className="prose prose-invert prose-indigo max-w-none mt-6">
									{parse(post.content)}
								</div>

								{/* Comments Section */}
								{/* <div className="mt-10 border-t border-white/10 pt-6">
									<h2 className="text-xl font-semibold mb-4">
										Comments
									</h2> */}


									{/* List of comments */}
									{/* <div className="mt-6">
										<CommentList postId={post.$id} />
									</div>
								</div> */}
							</div>
						</article>

						{/* Sidebar */}
						<aside className="space-y-6">
							<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6">
								<h3 className="text-sm font-medium text-white/90">
									Post details
								</h3>
								<dl className="mt-4 space-y-3 text-sm text-white/70">
									<dt>Status</dt>
									<dd className="capitalize">
										{post.status}
									</dd>
								</dl>

								<div className="mt-6 flex items-center gap-3">
									<Link
										to="/"
										className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
									>
										Back
									</Link>
									<Link
										to="/all-posts"
										className="rounded-xl bg-indigo-500 px-4 py-2 text-sm"
									>
										All posts
									</Link>
								</div>
							</div>
						</aside>
					</div>
				) : null}
			</Container>

			{/* Delete modal */}
			{showConfirm && (
				<div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4">
					<div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6">
						<h4 className="text-lg font-semibold">Delete post?</h4>
						<p className="mt-1 text-sm text-white/70">
							This action cannot be undone.
						</p>
						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								onClick={() => setShowConfirm(false)}
								className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
							>
								Cancel
							</button>
							<Button
								bgColor="bg-red-500"
								className="!py-2 !px-4 !text-sm"
								onClick={deletePost}
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
