'use client';

import { motion } from 'framer-motion';
import {
	BookOpen,
	Zap,
	Lightbulb,
	Code,
	Heart,
	TrendingUp,
} from 'lucide-react';
import { useRef, useState } from 'react';

const blogCards = [
	{
		id: 1,
		title: 'The Future of Blogging',
		category: 'Tech',
		author: 'Alex Chen',
		icon: <Code className="w-5 h-5" />,
		categoryColor: 'bg-blue-100 text-blue-700',
		delay: 0,
		position: { x: -120, y: -40, z: 10 },
	},
	{
		id: 2,
		title: 'Finding Your Voice Online',
		category: 'Lifestyle',
		author: 'Sarah Miller',
		icon: <BookOpen className="w-5 h-5" />,
		categoryColor: 'bg-purple-100 text-purple-700',
		delay: 0.1,
		position: { x: 100, y: 60, z: 5 },
	},
	{
		id: 3,
		title: 'Creative Writing Tips',
		category: 'Writing',
		author: 'James Wilson',
		icon: <Lightbulb className="w-5 h-5" />,
		categoryColor: 'bg-yellow-100 text-yellow-700',
		delay: 0.2,
		position: { x: -80, y: 80, z: 8 },
	},
	{
		id: 4,
		title: 'Wellness Through Writing',
		category: 'Health',
		author: 'Emma Johnson',
		icon: <Heart className="w-5 h-5" />,
		categoryColor: 'bg-red-100 text-red-700',
		delay: 0.3,
		position: { x: 120, y: -80, z: 6 },
	},
	{
		id: 5,
		title: 'Trending Topics This Week',
		category: 'Culture',
		author: 'David Park',
		icon: <TrendingUp className="w-5 h-5" />,
		categoryColor: 'bg-green-100 text-green-700',
		delay: 0.4,
		position: { x: 0, y: -20, z: 12 },
	},
	{
		id: 6,
		title: 'Building Communities Online',
		category: 'Community',
		author: 'Lisa Anderson',
		icon: <Zap className="w-5 h-5" />,
		categoryColor: 'bg-indigo-100 text-indigo-700',
		delay: 0.5,
		position: { x: -140, y: 20, z: 7 },
	},
];

export function FloatingBlogCards() {
	const containerRef = useRef(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		setMousePosition({ x: x * 10, y: y * 10 });
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 30,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
			},
		},
	};

	return (
		<div
			ref={containerRef}
			onMouseMove={handleMouseMove}
			className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective"
		>
			{/* Background gradient blur elements */}
			<motion.div
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full blur-3xl -z-10"
			/>

			{/* Floating accent dots */}
			<motion.div
				animate={{
					y: [0, -20, 0],
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full -z-10"
			/>

			<motion.div
				animate={{
					y: [0, 15, 0],
					opacity: [0.4, 0.7, 0.4],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 1,
				}}
				className="absolute bottom-40 left-20 w-2 h-2 bg-blue-300 rounded-full -z-10"
			/>

			{/* Cards container */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative w-full h-full flex mb-20 items-center justify-center"
				style={{
					perspective: '1200px',
					transformStyle: 'preserve-3d',
				}}
			>
				{blogCards.map((card) => (
					<motion.div
						key={card.id}
						ref={containerRef}
						variants={cardVariants}
						animate={{
							y: [
								0 +
									mousePosition.y *
										(1 - card.position.z / 100),
								-15 +
									mousePosition.y *
										(1 - card.position.z / 100),
								0 +
									mousePosition.y *
										(1 - card.position.z / 100),
							],
							x: mousePosition.x * (1 - card.position.z / 100),
							rotate: [-2, 2, -2],
						}}
						transition={{
							y: {
								duration: 4 + card.delay * 2,
								repeat: Infinity,
								ease: 'easeInOut',
							},
							rotate: {
								duration: 6 + card.delay * 2,
								repeat: Infinity,
								ease: 'easeInOut',
							},
							x: {
								duration: 0.5,
								ease: 'easeOut',
							},
						}}
						whileHover={{
							scale: 1.05,
							translateY: -8,
							boxShadow:
								'0 20px 40px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)',
							transition: { duration: 0.3 },
						}}
						className="absolute"
						style={{
							left: `calc(50% + ${card.position.x}px)`,
							top: `calc(50% + ${card.position.y}px)`,
							transform: 'translateX(-50%) translateY(-50%)',
							zIndex: card.position.z,
							opacity: 0.7 + (card.position.z / 20) * 0.3,
						}}
					>
						<motion.div
							className="w-64 border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer backdrop-blur-sm bg-white/95"
							whileHover={{
								boxShadow:
									'0 25px 50px rgba(59, 130, 246, 0.25), 0 0 25px rgba(59, 130, 246, 0.15)',
							}}
						>
							{/* Card Header */}
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold mb-2 ${card.categoryColor}`}
									>
										{card.icon}
										{card.category}
									</div>
								</div>
							</div>

							{/* Card Title */}
							<h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
								{card.title}
							</h3>

							{/* Card Footer */}
							<div className="flex items-center justify-between pt-3 border-t border-gray-100">
								<span className="text-sm font-medium text-gray-600">
									{card.author}
								</span>
								<motion.div
									animate={{ x: [0, 2, 0] }}
									transition={{
										duration: 2,
										repeat: Infinity,
									}}
									className="text-blue-600"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				))}
			</motion.div>
		</div>
	);
}
