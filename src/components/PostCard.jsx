import React from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function PostCard({ $id, title, featuredImage, content }) {
	return (
		<Link to={`/post/${$id}`} className="block h-full">
			<motion.div
				whileHover={{ y: -4 }}
				transition={{ duration: 0.3 }}
				className="group h-full overflow-hidden border border-[#E5E7EB] bg-white shadow-sm hover:shadow-lg hover:border-[#2563EB] transition-all duration-300"
			>
				{/* Image */}
				<div className="relative w-full overflow-hidden h-[55%]">
					<motion.img
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.4 }}
						src={appwriteService.getFilePreview(featuredImage)}
						alt={title}
						className="aspect-[4/3] w-full object-cover"
						loading="lazy"
					/>
				</div>

				{/* Content */}
				<div className="flex flex-col pt-3 p-5 justify-between h-[45%] ">
					<div>
						<h2 className="text-lg font-bold tracking-tight text-[#111827] group-hover:text-[#2563EB] transition-colors duration-300 line-clamp-2">
							{title}
						</h2>

						{content && (
							<p className="mt-2 text-[#6B7280] text-sm line-clamp-2 leading-relaxed">
								{parse(content)}
							</p>
						)}
					</div>

					{/* Read more footer */}
					<div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
						<span className="text-sm font-medium text-[#2563EB] group-hover:text-[#1d4ed8] transition-colors">
							Read more
						</span>
						<motion.div
							animate={{ x: [0, 6, 0] }}
							transition={{
								repeat: Infinity,
								duration: 1.5,
								ease: 'easeInOut',
							}}
							className="opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<ArrowRight className="w-5 h-5 text-[#2563EB]" />
						</motion.div>
					</div>
				</div>
			</motion.div>
		</Link>
	);
}

export default PostCard;
