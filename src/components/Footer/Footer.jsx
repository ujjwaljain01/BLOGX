import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, ArrowUp, Mail } from 'lucide-react';
import Logo from '../Logo';

function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	return (
		<footer className="relative mt-16 border-t border-[#E5E7EB] bg-white/70 backdrop-blur-md">
			<div className="relative z-10 mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8 py-14">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid gap-10 md:grid-cols-2 lg:grid-cols-12"
				>
					{/* Brand + Newsletter */}
					<motion.div
						variants={itemVariants}
						className="lg:col-span-5"
					>
						<div className="flex items-center gap-3">
							<Logo width="64px" />
						</div>
						<p className="mt-4 text-sm text-[#6B7280] max-w-md leading-relaxed">
							Thoughts, tutorials, and stories from our creators.
							Join the community and never miss an update.
						</p>

						{/* Newsletter */}
						<form
							className="mt-6 flex w-full max-w-md items-center gap-2"
							onSubmit={(e) => e.preventDefault()}
						>
							<label htmlFor="newsletter" className="sr-only">
								Email address
							</label>
							<div className="relative flex-1">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
								<input
									id="newsletter"
									type="email"
									placeholder="Enter your email"
									className="w-full rounded-lg bg-white border border-[#E5E7EB] pl-11 pr-4 py-3 text-[#111827] placeholder-[#6B7280] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
									required
								/>
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								className="rounded-lg bg-[#2563EB] px-6 py-3 font-medium text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
							>
								Subscribe
							</motion.button>
						</form>

						{/* Socials */}
						<div className="mt-6 flex items-center gap-3">
							{[
								{
									name: 'Twitter',
									href: '#',
									icon: Twitter,
								},
								{
									name: 'GitHub',
									href: '#',
									icon: Github,
								},
								{
									name: 'LinkedIn',
									href: '#',
									icon: Linkedin,
								},
							].map((social) => (
								<motion.a
									key={social.name}
									href={social.href}
									aria-label={social.name}
									whileHover={{ scale: 1.1, y: -2 }}
									whileTap={{ scale: 0.95 }}
									className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:text-[#2563EB] hover:border-[#2563EB] hover:shadow-md"
								>
									<social.icon className="w-5 h-5" />
								</motion.a>
							))}
						</div>
					</motion.div>

					{/* Link Columns */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
						<motion.div variants={itemVariants}>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
								Company
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Features', to: '/' },
									{ label: 'Pricing', to: '/' },
									{ label: 'Affiliate Program', to: '/' },
									{ label: 'Press Kit', to: '/' },
								].map((item) => (
									<li key={item.label}>
										<Link
											to={item.to}
											className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors inline-block"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						<motion.div variants={itemVariants}>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
								Support
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Account', to: '/' },
									{ label: 'Help', to: '/' },
									{ label: 'Contact Us', to: '/' },
									{ label: 'Customer Support', to: '/' },
								].map((item) => (
									<li key={item.label}>
										<Link
											to={item.to}
											className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors inline-block"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						<motion.div variants={itemVariants}>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
								Legals
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Terms & Conditions', to: '/' },
									{ label: 'Privacy Policy', to: '/' },
									{ label: 'Licensing', to: '/' },
								].map((item) => (
									<li key={item.label}>
										<Link
											to={item.to}
											className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors inline-block"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
					</div>
				</motion.div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-[#E5E7EB] pt-6 text-sm text-[#6B7280] md:flex-row"
				>
					<p>
						© {new Date().getFullYear()} BlogX. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<Link
							to="/privacy"
							className="hover:text-[#2563EB] transition-colors"
						>
							Privacy
						</Link>
						<Link
							to="/terms"
							className="hover:text-[#2563EB] transition-colors"
						>
							Terms
						</Link>
						<motion.button
							onClick={scrollToTop}
							whileHover={{ y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="inline-flex items-center gap-1 hover:text-[#2563EB] transition-colors"
						>
							<ArrowUp className="w-4 h-4" />
							Back to top
						</motion.button>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}

export default Footer;
