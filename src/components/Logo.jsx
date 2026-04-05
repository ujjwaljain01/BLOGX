import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, NotebookPen } from 'lucide-react';

export default function Logo({ size = 36, compact = false }) {
	return (
		<Link
			to="/"
			className="flex items-center gap-3 no-underline group"
			aria-label="BlogX home"
		>
			<motion.div
				initial={{ rotate: -6, scale: 0.98 }}
				className="flex items-center justify-center"
				aria-hidden
			>
				<NotebookPen
					className="text-[#2563EB] group-hover:text-[#1d4ed8] transition-colors"
					size={size}
					strokeWidth={2}
				/>
			</motion.div>

			{!compact && (
				<div className="leading-tight">
					<span className="block font-bold text-lg tracking-wide text-[#111827] group-hover:text-[#2563EB] transition-colors">
						BlogX
					</span>
					<span className="block text-xs -mt-0.5 text-[#6B7280]">
						Stories • Dev • Notes
					</span>
				</div>
			)}
		</Link>
	);
}
