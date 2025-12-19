import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function Logo({ size = 36, compact = false }) {
	return (
		<Link
			to="/"
			className="flex items-center gap-3 no-underline"
			aria-label="BlogX home"
		>
			<motion.div
				initial={{ rotate: -6, scale: 0.98 }}
				whileHover={{ rotate: 0, scale: 1.05 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className="flex items-center justify-center"
				aria-hidden
			>
				<BookOpen className="text-white" size={size} />
			</motion.div>

			{!compact && (
				<div className="leading-tight">
					<span className="block text-white font-semibold text-lg tracking-wide">
						BlogX
					</span>
					<span className="block text-white/60 text-xs -mt-0.5">
						Stories • Dev • Notes
					</span>
				</div>
			)}
		</Link>
	);
}
