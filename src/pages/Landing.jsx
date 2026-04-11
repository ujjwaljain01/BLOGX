import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
	ArrowRight,
	PenTool,
	Users,
	Zap,
	BookOpen,
	Code,
	Heart,
	Lightbulb,
	TrendingUp,
	Star,
	Sparkles,
	Feather,
} from 'lucide-react';
import { FloatingBlogCards } from '../components';

/* ─── Reusable animated button ─── */
function AnimatedButton({
	children,
	onClick,
	className = '',
	variant = 'primary',
}) {
	const [ripples, setRipples] = useState([]);

	const handleClick = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const id = Date.now();
		setRipples((prev) => [...prev, { x, y, id }]);
		setTimeout(
			() => setRipples((prev) => prev.filter((r) => r.id !== id)),
			700,
		);
		onClick?.();
	};

	return (
		<motion.button
			onClick={handleClick}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.97 }}
			transition={{ type: 'spring', stiffness: 400, damping: 17 }}
			className={`relative overflow-hidden ${
				variant === 'primary'
					? 'bg-blue-600 text-white shadow-[0_4px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.5)]'
					: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
			} rounded-full font-semibold flex items-center transition-shadow ${className}`}
		>
			{/* Shimmer sweep on hover */}
			<motion.span
				className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
				initial={{ x: '-100%' }}
				whileHover={{ x: '200%' }}
				transition={{ duration: 0.6, ease: 'easeInOut' }}
			/>

			{/* Click ripples */}
			<AnimatePresence>
				{ripples.map((r) => (
					<motion.span
						key={r.id}
						className="pointer-events-none absolute rounded-full bg-white/30"
						style={{ left: r.x - 10, top: r.y - 10 }}
						initial={{ width: 20, height: 20, opacity: 0.6 }}
						animate={{
							width: 200,
							height: 200,
							opacity: 0,
							x: -90,
							y: -90,
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.65, ease: 'easeOut' }}
					/>
				))}
			</AnimatePresence>

			{children}
		</motion.button>
	);
}

/* ─── Animated arrow ─── */
function ArrowIcon() {
	return (
		<motion.span
			className="ml-2 flex items-center"
			initial={{ x: 0 }}
			whileHover={{ x: 4 }}
			transition={{ type: 'spring', stiffness: 400, damping: 15 }}
		>
			<ArrowRight className="w-5 h-5" />
		</motion.span>
	);
}

export default function Landing() {
	const navigate = useNavigate();
	const heroRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
	const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

	const fadeInUp = {
		initial: { opacity: 0, y: 30 },
		whileInView: { opacity: 1, y: 0 },
		transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
		viewport: { once: true, margin: '0px 0px -80px 0px' },
	};

	const staggerContainer = {
		initial: { opacity: 0 },
		whileInView: { opacity: 1 },
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
		viewport: { once: true, margin: '0px 0px -60px 0px' },
	};

	const staggerItem = {
		initial: { opacity: 0, y: 24 },
		whileInView: { opacity: 1, y: 0 },
		transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
	};

	const categories = [
		{
			name: 'Tech',
			icon: Code,
			color: 'from-blue-400 to-blue-600',
			bg: 'bg-blue-50',
			text: 'text-blue-600',
		},
		{
			name: 'Lifestyle',
			icon: Heart,
			color: 'from-pink-400 to-pink-600',
			bg: 'bg-pink-50',
			text: 'text-pink-600',
		},
		{
			name: 'Self-Improvement',
			icon: Lightbulb,
			color: 'from-yellow-400 to-yellow-600',
			bg: 'bg-yellow-50',
			text: 'text-yellow-600',
		},
		{
			name: 'Health',
			icon: TrendingUp,
			color: 'from-green-400 to-green-600',
			bg: 'bg-green-50',
			text: 'text-green-600',
		},
		{
			name: 'Marketing',
			icon: Zap,
			color: 'from-purple-400 to-purple-600',
			bg: 'bg-purple-50',
			text: 'text-purple-600',
		},
		{
			name: 'Media',
			icon: BookOpen,
			color: 'from-indigo-400 to-indigo-600',
			bg: 'bg-indigo-50',
			text: 'text-indigo-600',
		},
		{
			name: 'Gaming',
			icon: Star,
			color: 'from-orange-400 to-orange-600',
			bg: 'bg-orange-50',
			text: 'text-orange-600',
		},
		{
			name: 'Society',
			icon: Users,
			color: 'from-red-400 to-red-600',
			bg: 'bg-red-50',
			text: 'text-red-600',
		},
	];

	const features = [
		{
			icon: PenTool,
			title: 'Minimal Writing Experience',
			description:
				'Distraction-free editor designed for pure focus and creativity.',
		},
		{
			icon: Users,
			title: 'Community-Driven',
			description:
				'Connect with like-minded writers and build meaningful relationships.',
		},
		{
			icon: TrendingUp,
			title: 'Discover Trending Blogs',
			description:
				'Find the most engaging content across all categories.',
		},
		{
			icon: BookOpen,
			title: 'Explore Categories',
			description:
				'Browse curated collections of stories from around the world.',
		},
	];

	const blogs = [
		{
			title: 'The Art of Minimal Writing',
			excerpt:
				'Discover how simplicity can transform your writing and captivate readers.',
			category: 'Self-Improvement',
			author: 'Sarah Chen',
			categoryColor: 'bg-yellow-100 text-yellow-800',
		},
		{
			title: 'Building Scalable Web Applications',
			excerpt:
				'A deep dive into modern architecture patterns and best practices.',
			category: 'Tech',
			author: 'James Rodriguez',
			categoryColor: 'bg-blue-100 text-blue-800',
		},
		{
			title: 'The Future of Digital Health',
			excerpt:
				'How technology is reshaping the way we approach wellness and healthcare.',
			category: 'Health',
			author: 'Dr. Emma Watson',
			categoryColor: 'bg-green-100 text-green-800',
		},
	];

	const testimonials = [
		{
			name: 'Alex Johnson',
			role: 'Tech Writer',
			avatar: 'AJ',
			feedback:
				'BlogX changed how I approach writing. The minimal interface keeps me focused on what matters most.',
		},
		{
			name: 'Maria Garcia',
			role: 'Creative Blogger',
			avatar: 'MG',
			feedback:
				'I love the community here. Finding my audience and connecting with other writers has been incredible.',
		},
	];

	/* Letter-by-letter animation for "BlogX" */
	const appName = 'BlogX';
	const letterVariants = {
		initial: { opacity: 0, y: 40, rotate: -10 },
		animate: (i) => ({
			opacity: 1,
			y: 0,
			rotate: 0,
			transition: {
				delay: 0.1 + i * 0.08,
				duration: 0.5,
				ease: [0.25, 0.46, 0.45, 0.94],
			},
		}),
	};

	return (
		<div className="w-full bg-white">
			{/* ══ Hero Section ══ */}
			<section
				ref={heroRef}
				className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 md:py-0 overflow-hidden"
			>
				{/* Background glow orbs */}
				<motion.div
					className="pointer-events-none absolute inset-0 -z-10"
					animate={{ opacity: [0.4, 0.7, 0.4] }}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				>
					<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-60" />
					<div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-100 blur-3xl opacity-40" />
				</motion.div>

				<motion.div
					style={{ y: heroY, opacity: heroOpacity }}
					className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full"
				>
					{/* ── Left: Text content ── */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
						className="text-center lg:text-left py-20 md:py-0"
					>
						{/* ── APP NAME BLOCK ── */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="flex flex-col items-center lg:items-start mb-6"
						>
							{/* Logo row */}
							<div className="flex items-center gap-3 mb-3">
								<motion.div
									animate={{ rotate: [0, -8, 8, -4, 0] }}
									transition={{
										delay: 0.6,
										duration: 0.8,
										ease: 'easeInOut',
									}}
									className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(37,99,235,0.4)]"
								>
									<Feather className="w-6 h-6 text-white" />
								</motion.div>

								{/* Letter-by-letter app name */}
								<div className="flex items-end gap-0.5 overflow-hidden">
									{appName.split('').map((letter, i) => (
										<motion.span
											key={i}
											custom={i}
											variants={letterVariants}
											initial="initial"
											animate="animate"
											className={`text-4xl font-black leading-none tracking-tight ${
												letter === 'X'
													? 'text-blue-600'
													: 'text-gray-900'
											}`}
										>
											{letter}
										</motion.span>
									))}
								</div>
							</div>

							{/* Tagline under name */}
							<motion.p
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.7, duration: 0.5 }}
								className="text-xs font-semibold tracking-[0.18em] text-blue-500 uppercase"
							>
								Write · Share · Inspire
							</motion.p>

							{/* Animated underline */}
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{
									delay: 0.85,
									duration: 0.6,
									ease: 'easeOut',
								}}
								style={{ transformOrigin: 'left' }}
								className="mt-2 h-0.5 w-24 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full lg:mx-0 mx-auto"
							/>
						</motion.div>

						{/* Community pill badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.95, duration: 0.5 }}
							className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8 "
						>
							<Sparkles className="w-4 h-4" />
							The home for thoughtful writers
						</motion.div>

						{/* Headline */}
						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-12 text-balance">
							<motion.div
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.7, delay: 1.0 }}
								className="mb-5 -rotate-6"
							>
								Write{' '}
								<motion.span
									className="bg-blue-600 rounded-xl p-1 text-white inline-block"
									whileHover={{ rotate: -2, scale: 1.04 }}
									transition={{
										type: 'spring',
										stiffness: 300,
									}}
								>
									Freely.
								</motion.span>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.7, delay: 1.12 }}
								className="mt-10 -rotate-6"
							>
								Share{' '}
								<motion.span
									className="bg-blue-600 rounded-xl p-1 text-white inline-block"
									whileHover={{ rotate: 2, scale: 1.04 }}
									transition={{
										type: 'spring',
										stiffness: 300,
									}}
								>
									Boldly.
								</motion.span>
							</motion.div>
						</h1>

						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.25, duration: 0.6 }}
							className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
						>
							Join a community of writers dedicated to
							distraction-free writing and meaningful
							storytelling. Discover trending blogs across diverse
							categories.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 1.38 }}
							className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
						>
							<AnimatedButton
								onClick={() => navigate('/signup')}
								className="px-8 h-14 text-base"
							>
								Start Writing
								<ArrowIcon />
							</AnimatedButton>

							<AnimatedButton
								variant="outline"
								className="px-8 h-14 text-base"
							>
								Explore Stories
							</AnimatedButton>
						</motion.div>
					</motion.div>

					{/* Floating Blog Cards */}
					<div className="hidden lg:flex justify-center items-center h-full min-h-screen">
						<FloatingBlogCards />
					</div>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.6 }}
				>
					<div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1">
						<motion.div
							className="w-1 h-2 bg-gray-400 rounded-full"
							animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>
					</div>
				</motion.div>
			</section>

			{/* ══ Features Section ══ */}
			<section className="py-20 md:py-32 px-4 bg-white">
				<div className="max-w-6xl mx-auto">
					<motion.div {...fadeInUp} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 gap-2 flex justify-center">
							<div>Why Choose</div>
							<motion.span
								className="bg-blue-600 rounded-xl p-1 text-white"
								whileHover={{ scale: 1.06, rotate: -1 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								BlogX?
							</motion.span>
						</h2>
						<p className="text-lg text-gray-600">
							Everything you need to write, share, and grow your
							audience.
						</p>
					</motion.div>

					<motion.div
						{...staggerContainer}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
					>
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<motion.div
									key={index}
									{...staggerItem}
									whileHover={{ scale: 1.04, y: -6 }}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 20,
									}}
									className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all cursor-default"
								>
									<motion.div
										whileHover={{
											rotate: [0, -8, 8, 0],
											scale: 1.15,
										}}
										transition={{ duration: 0.4 }}
										className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4"
									>
										<Icon className="w-6 h-6 text-blue-600" />
									</motion.div>
									<h3 className="text-lg font-semibold text-foreground mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-sm">
										{feature.description}
									</p>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* ══ Categories Section ══ */}
			<section className="py-20 md:py-32 px-4 bg-gray-50">
				<div className="max-w-6xl mx-auto">
					<motion.div {...fadeInUp} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex justify-center items-center gap-2">
							Explore
							<motion.span
								className="bg-blue-600 rounded-xl p-1 text-white"
								whileHover={{ scale: 1.06, rotate: 1 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								Categories
							</motion.span>
						</h2>
						<p className="text-lg text-gray-600">
							Discover stories from every corner of the world.
						</p>
					</motion.div>

					<motion.div
						{...staggerContainer}
						className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
					>
						{categories.map((category, index) => {
							const Icon = category.icon;
							return (
								<motion.div
									key={index}
									{...staggerItem}
									whileHover={{ scale: 1.07, y: -6 }}
									whileTap={{ scale: 0.96 }}
									transition={{
										type: 'spring',
										stiffness: 350,
										damping: 18,
									}}
									className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all cursor-pointer text-center relative overflow-hidden"
								>
									<motion.div
										className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}
									/>
									<div className="flex justify-center mb-3">
										<motion.div
											className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center`}
											whileHover={{ rotate: 10 }}
											transition={{
												type: 'spring',
												stiffness: 400,
											}}
										>
											<Icon
												className={`w-6 h-6 ${category.text}`}
											/>
										</motion.div>
									</div>
									<h3 className="font-semibold text-foreground">
										{category.name}
									</h3>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* ══ Blog Preview Section ══ */}
			<section className="py-20 md:py-32 px-4 bg-white">
				<div className="max-w-6xl mx-auto">
					<motion.div {...fadeInUp} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex justify-center items-center gap-2">
							Featured
							<motion.span
								className="bg-blue-600 rounded-xl p-1 text-white"
								whileHover={{ scale: 1.06, rotate: -1 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								Stories
							</motion.span>
						</h2>
						<p className="text-lg text-gray-600">
							Latest posts from our community of writers.
						</p>
					</motion.div>

					<motion.div
						{...staggerContainer}
						className="grid grid-cols-1 md:grid-cols-3 gap-6"
					>
						{blogs.map((blog, index) => (
							<motion.div
								key={index}
								{...staggerItem}
								whileHover={{ scale: 1.03, y: -6 }}
								whileTap={{ scale: 0.98 }}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 20,
								}}
								className="relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer overflow-hidden group"
							>
								<div className="mb-4">
									<span
										className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${blog.categoryColor}`}
									>
										{blog.category}
									</span>
								</div>
								<h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
									{blog.title}
								</h3>
								<p className="text-gray-600 text-sm mb-4 line-clamp-2">
									{blog.excerpt}
								</p>
								<div className="flex items-center justify-between pt-4 border-t border-gray-100">
									<span className="text-sm font-medium text-gray-600">
										{blog.author}
									</span>
									<motion.div
										className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"
										whileHover={{
											x: 3,
											backgroundColor: '#2563eb',
										}}
										transition={{
											type: 'spring',
											stiffness: 400,
										}}
									>
										<ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
									</motion.div>
								</div>
								<motion.div
									className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-2xl"
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{
										duration: 0.4,
										ease: 'easeOut',
									}}
									style={{ transformOrigin: 'left' }}
								/>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ══ Testimonials Section ══ */}
			<section className="py-20 md:py-32 px-4 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<motion.div {...fadeInUp} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
							Loved by Writers
						</h2>
						<p className="text-lg text-gray-600">
							See what our community has to say.
						</p>
					</motion.div>

					<motion.div
						{...staggerContainer}
						className="grid grid-cols-1 md:grid-cols-2 gap-6"
					>
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={index}
								{...staggerItem}
								whileHover={{ scale: 1.02, y: -4 }}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 20,
								}}
								className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all"
							>
								<div className="flex items-center gap-4 mb-4">
									<motion.div
										whileHover={{ scale: 1.12, rotate: 5 }}
										transition={{
											type: 'spring',
											stiffness: 400,
										}}
										className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0"
									>
										<span className="text-sm font-bold text-blue-600">
											{testimonial.avatar}
										</span>
									</motion.div>
									<div>
										<h4 className="font-semibold text-foreground">
											{testimonial.name}
										</h4>
										<p className="text-sm text-gray-500">
											{testimonial.role}
										</p>
									</div>
								</div>
								<p className="text-gray-700 italic leading-relaxed">
									&quot;{testimonial.feedback}&quot;
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ══ Final CTA Section ══ */}
			<section className="relative py-24 md:py-32 px-4 bg-white overflow-hidden">
				<motion.div
					className="pointer-events-none absolute inset-0 -z-10"
					animate={{ opacity: [0.5, 0.9, 0.5] }}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				>
					<div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-blue-50 blur-3xl" />
					<div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-50 blur-3xl" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.8,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
					viewport={{ once: true }}
					className="relative z-10 max-w-2xl mx-auto text-center"
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						whileInView={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
					>
						<Sparkles className="w-4 h-4" />
						Free to join
					</motion.div>

					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
						Ready to Share Your Voice?
					</h2>
					<p className="text-lg text-gray-600 mb-10">
						Join a community of writers today and start crafting
						your stories without distraction.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<AnimatedButton
							onClick={() => navigate('/signup')}
							className="px-10 h-16 text-lg"
						>
							Join Community
							<ArrowIcon />
						</AnimatedButton>

						<AnimatedButton
							variant="outline"
							className="px-10 h-16 text-lg"
						>
							Read Stories
						</AnimatedButton>
					</div>
				</motion.div>
			</section>
		</div>
	);
}
