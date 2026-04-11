import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Feather} from 'lucide-react';

export default function Logo({ size = 36, compact = false }) {
	return (
		<Link
			to="/"
			className="flex items-center gap-2 no-underline group"
			aria-label="BlogX home"
		>
			<motion.div
				initial={{ rotate: -6, scale: 0.98 }}
				className="flex items-center justify-center"
				aria-hidden
			>
				<Feather
					className="text-[#2563EB] group-hover:text-[#1d4ed8] transition-colors"
					size={size}
					strokeWidth={2}
				/>
			</motion.div>

			{!compact && (
				<div className="leading-tight">
					<span className="block font-bold text-sm tracking-wide text-[#111827] group-hover:text-[#2563EB] transition-colors">
						Blog
						<span className='text-blue-600'>X</span>
					</span>
					<motion.p
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="text-[0.5rem] font-semibold tracking-[0.18em] text-blue-500 uppercase"
					>
						Write · Share · Inspire
					</motion.p>
				</div>
			)}
		</Link>
	);
}
