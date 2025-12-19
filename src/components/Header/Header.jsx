import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Logo, LogoutBtn, Button } from '../index';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Responsive header that uses the Button + Logo components.
 * - Desktop: inline nav with animated underline (framer-motion layoutId)
 * - Mobile: collapsible menu
 * Accessibility: proper aria-labels and keyboard-focus friendly classes
 */
export default function Header() {
	const authStatus = useSelector((state) => state.auth?.status);
	const location = useLocation();
	const [open, setOpen] = useState(false);

	const navItems = [
		{ name: 'Home', slug: '/', show: true },
		{ name: 'All Posts', slug: '/all-posts', show: !!authStatus },
		{ name: 'Add Post', slug: '/add-post', show: !!authStatus },
		{ name: 'Login', slug: '/login', show: !authStatus },
		{ name: 'Signup', slug: '/signup', show: !authStatus },
	];

	const isActive = (slug) => location.pathname === slug;

	return (
		<header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-white/6 to-transparent border-b border-white/6">
			<div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-6">
						<Logo />
					</div>

					{/* Desktop nav */}
					<nav
						className="hidden md:flex items-center gap-3"
						aria-label="Primary navigation"
					>
						{navItems.map(
							(item) =>
								item.show && (
									<div key={item.slug} className="relative">
										<Button
											to={item.slug}
											variant={
												isActive(item.slug)
													? 'solid'
													: 'text'
											}
											className={`relative font-medium ${
												isActive(item.slug)
													? 'bg-indigo-600/90 text-white'
													: 'text-white/80 hover:text-white'
											}`}
										>
											<span className="z-10">
												{item.name}
											</span>

											{/* animated underline using framer-motion */}
											<motion.span
												layoutId="nav-underline"
												initial={false}
												animate={
													isActive(item.slug)
														? {
																scaleX: 1,
																opacity: 1,
														  }
														: {
																scaleX: 0,
																opacity: 0,
														  }
												}
												transition={{ duration: 0.22 }}
												className="absolute left-2 right-2 bottom-0 h-[2px] origin-left bg-indigo-400"
												style={{
													transformOrigin: 'left',
												}}
												aria-hidden
											/>
										</Button>
									</div>
								)
						)}

						{authStatus && (
							<div className="ml-2">
								<LogoutBtn />
							</div>
						)}
					</nav>

					{/* Mobile actions */}
					<div className="md:hidden flex items-center gap-2">
						<Button
							variant="unstyled"
							className="p-2"
							onClick={() => setOpen((s) => !s)}
							aria-expanded={open}
							aria-label="Toggle menu"
						>
							{!open ? <Menu size={22} /> : <X size={22} />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile menu - animated */}
			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={
					open
						? { height: 'auto', opacity: 1 }
						: { height: 0, opacity: 0 }
				}
				transition={{ duration: 0.22 }}
				className="md:hidden overflow-hidden border-t border-white/6"
			>
				<div className="px-4 pt-3 pb-4 space-y-2">
					{navItems.map(
						(item) =>
							item.show && (
								<div key={item.slug}>
									<Button
										to={item.slug}
										variant={
											isActive(item.slug)
												? 'solid'
												: 'text'
										}
										className={`w-full text-left ${
											isActive(item.slug)
												? 'bg-indigo-600/90 text-white'
												: 'text-white/80'
										}`}
										onClick={() => setOpen(false)}
									>
										{item.name}
									</Button>
								</div>
							)
					)}

					{authStatus && (
						<div className="pt-1">
							<LogoutBtn />
						</div>
					)}
				</div>
			</motion.div>
		</header>
	);
}
