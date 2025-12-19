import React from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage, excerpt }) {
	return (
		<Link
			to={`/post/${$id}`}
			className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl transition hover:border-indigo-400/30 hover:bg-white/15 hover:shadow-[0_8px_40px_rgb(49,46,129,0.15)]"
		>
			{/* Image */}
			<div className="relative w-full overflow-hidden rounded-t-2xl">
				<img
					src={appwriteService.getFilePreview(
						featuredImage
					)}
					alt={title}
					className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-0 transition group-hover:opacity-100" />
			</div>

			{/* Content */}
			<div className="flex flex-col justify-between p-5">
				<h2 className="text-lg font-semibold tracking-tight text-white transition group-hover:text-indigo-300">
					{title.length > 60 ? title.slice(0, 60) + '…' : title}
				</h2>
				{excerpt && (
					<p className="mt-2 text-sm text-white/70 line-clamp-2">
						{excerpt.length > 90
							? excerpt.slice(0, 90) + '…'
							: excerpt}
					</p>
				)}

				<div className="mt-4 flex items-center justify-between text-xs text-white/60">
					<span className="transition group-hover:text-indigo-300">
						Read more →
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-4 w-4 opacity-70 transition group-hover:translate-x-1 group-hover:opacity-100"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
						/>
					</svg>
				</div>
			</div>
		</Link>
	);
}

export default PostCard;
