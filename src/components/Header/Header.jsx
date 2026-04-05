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
		{ name: 'Home', slug: '/', icon: Home, show: true },

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
				<div className="flex items-center justify-between h-16">
					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center justify-between w-full">
						{/* LEFT - Logo */}
						<div className="flex items-center">
							<Logo />
						</div>

						{/* CENTER */}
						<nav className="flex items-center gap-2 ml-40">
							{center.map((item) => {
								const Icon = item.icon;

								return (
									<Link
										key={item.slug}
										to={item.slug}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
											isActive(item.slug)
												? 'bg-[#2563EB] text-white'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<Icon size={18} />
										{item.name}
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
											className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition 
												bg-[#2563EB] text-white hover:opacity-90`}
										>
											<Icon size={18} />
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
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition`}
									>
										<Icon size={18} />
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

					{/* Mobile Menu Button */}
					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={() => setOpen((s) => !s)}
						className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
						aria-expanded={open}
						aria-label="Toggle menu"
					>
						<AnimatePresence mode="wait">
							{!open ? (
								<motion.div
									key="menu"
									initial={{ rotate: -90, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: 90, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<Menu size={24} />
								</motion.div>
							) : (
								<motion.div
									key="close"
									initial={{ rotate: 90, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: -90, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<X size={24} />
								</motion.div>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="md:hidden overflow-hidden border-t border-[#E5E7EB] bg-[#F9FAFB]"
					>
						<div className="px-4 py-4 space-y-1">
							{navItems.map(
								(item) =>
									item.show && (
										<motion.div
											key={item.slug}
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ duration: 0.2 }}
										>
											<Link
												to={item.slug}
												onClick={() => setOpen(false)}
												className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
													isActive(item.slug)
														? 'text-white bg-[#2563EB]'
														: 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
												}`}
											>
												<div className="flex items-center gap-3">
													<Icon size={18} />
													{item.name}
												</div>
											</Link>
										</motion.div>
									),
							)}

							{authStatus && (
								<motion.div
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.2, delay: 0.1 }}
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
