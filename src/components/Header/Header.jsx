import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Logo, LogoutBtn, Button } from '../index';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import {
	Home,
	Compass,
	Flame,
	Search,
	PenSquare,
	User,
	LogIn,
	Rocket,
	Layers,
} from 'lucide-react';

export default function Header() {
	const authStatus = useSelector((state) => state.auth?.status);
	const location = useLocation();
	const [open, setOpen] = useState(false);

	const navItems = [
		{ name: 'Home', slug: '/home', icon: Home, show: true },

		// Logged-in only
		{
			name: 'Trending',
			slug: '/all-posts',
			icon: Flame,
			show: !!authStatus,
		},
		{
			name: 'Write',
			slug: '/add-post',
			icon: PenSquare,
			show: !!authStatus,
		},
		{ name: 'Profile', slug: '/profile', icon: User, show: !!authStatus },

		// Common
		{ name: 'Explore', slug: '/explore', icon: Compass, show: true },

		// Auth
		{ name: 'Login', slug: '/login', icon: LogIn, show: !authStatus },
		{
			name: 'GetStarted',
			slug: '/signup',
			icon: Rocket,
			show: !authStatus,
		},
	];

	const center = navItems.filter(
		(item) =>
			['Home', 'Explore', 'Trending'].includes(item.name) && item.show,
	);

	const right = navItems.filter(
		(item) =>
			['Write', 'Profile', 'Login', 'GetStarted'].includes(item.name) &&
			item.show,
	);

	const isActive = (slug) => location.pathname === slug;

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] shadow-sm">
			<div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 relative">
					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center justify-between w-full">
						{/* LEFT - Logo */}
						<div className="flex items-center">
							<Logo size={26} />
						</div>

						{/* CENTER */}
						<nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
							{center.map((item) => {
								const Icon = item.icon;

								return (
									<Link
										key={item.slug}
										to={item.slug}
										className={`relative flex items-center gap-1 mx-4 py-2 text-xs font-medium transition-colors duration-200 ${
											isActive(item.slug)
												? 'text-blue-600'
												: 'text-gray-700 hover:text-blue-600'
										}`}
									>
										<Icon size={14} />
										{item.name}

										{/* underline */}
										<span
											className={`absolute left-0 bottom-0 h-[2px] w-full bg-blue-600 transform transition-transform duration-300 ${
												isActive(item.slug)
													? 'scale-x-100'
													: 'scale-x-0'
											} origin-left`}
										/>
									</Link>
								);
							})}
						</nav>

						{/* RIGHT */}
						<div className="flex items-center gap-2">
							{right.map((item) => {
								const Icon = item.icon;

								// CTA button (Get Started / Write)
								if (
									item.name === 'GetStarted' ||
									item.name === 'Write'
								) {
									return (
										<Link
											key={item.slug}
											to={item.slug}
											className={`flex items-center gap-2 px-4 py-2 text-xs rounded-lg font-medium transition 
												bg-[#2563EB] text-white hover:opacity-90`}
										>
											<Icon size={14} />
											{item.name === 'GetStarted'
												? 'Get Started'
												: item.name}
										</Link>
									);
								}

								// Normal items (Profile / Login)
								return (
									<Link
										key={item.slug}
										to={item.slug}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition`}
									>
										<Icon size={14} />
										{item.name}
									</Link>
								);
							})}

							{authStatus && (
								<div className="">
									<LogoutBtn />
								</div>
							)}
						</div>
					</div>

					{/* Mobile: Logo + Hamburger */}
					<div className="flex md:hidden items-center justify-between w-full">
						<Logo size={24} />

						<motion.button
							whileTap={{ scale: 0.92 }}
							onClick={() => setOpen((s) => !s)}
							className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
							aria-expanded={open}
							aria-label="Toggle menu"
						>
							<AnimatePresence mode="wait" initial={false}>
								{!open ? (
									<motion.div
										key="menu"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{
											duration: 0.18,
											ease: 'easeOut',
										}}
									>
										<Menu size={22} />
									</motion.div>
								) : (
									<motion.div
										key="close"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{
											duration: 0.18,
											ease: 'easeOut',
										}}
									>
										<X size={22} />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="mobile-menu"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
						className="md:hidden overflow-hidden border-t border-[#E5E7EB] bg-[#F9FAFB]"
					>
						<div className="px-4 py-3 space-y-1">
							{navItems.map((item, index) => {
								if (!item.show) return null;

								// ✅ Icon is now correctly scoped per item
								const Icon = item.icon;
								const isCTA =
									item.name === 'GetStarted' ||
									item.name === 'Write';

								return (
									<motion.div
										key={item.slug}
										initial={{ x: -14, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{
											duration: 0.2,
											ease: 'easeOut',
											delay: index * 0.04,
										}}
									>
										<Link
											to={item.slug}
											onClick={() => setOpen(false)}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
												isCTA
													? 'bg-[#2563EB] text-white hover:opacity-90'
													: isActive(item.slug)
														? 'bg-[#2563EB] text-white'
														: 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
											}`}
										>
											<Icon size={17} />
											{item.name === 'GetStarted'
												? 'Get Started'
												: item.name}
										</Link>
									</motion.div>
								);
							})}

							{authStatus && (
								<motion.div
									initial={{ x: -14, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{
										duration: 0.2,
										ease: 'easeOut',
										delay: 0.2,
									}}
									className="pt-2 border-t border-[#E5E7EB]"
								>
									<LogoutBtn />
								</motion.div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
