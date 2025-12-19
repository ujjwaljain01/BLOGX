import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
	return (
		<footer className="relative mt-16 border-t border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
			{/* Glow accents */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
					{/* Brand + blurb + newsletter */}
					<div className="lg:col-span-5">
						<div className="flex items-center gap-3">
							<Logo width="64px" />
						</div>
						<p className="mt-4 text-sm text-white/70 max-w-md">
							Thoughts, tutorials, and stories from our creators.
							Join the community and never miss an update.
						</p>

						{/* Newsletter */}
						<form
							className="mt-5 flex w-full max-w-md items-center gap-2"
							onSubmit={(e) => e.preventDefault()}
						>
							<label htmlFor="newsletter" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter"
								type="email"
								placeholder="Enter your email"
								className="flex-1 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
								required
							/>
							<button
								type="submit"
								className="rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 focus:outline-none"
							>
								Subscribe
							</button>
						</form>

						{/* Socials */}
						<div className="mt-6 flex items-center gap-3">
							{[
								{
									name: 'X',
									href: '#',
									icon: (
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5"
											fill="currentColor"
											aria-hidden="true"
										>
											<path d="M18.244 3H21l-6.63 7.57L22 21h-6.553l-4.24-5.18L5.99 21H3.234l7.09-8.1L2 3h6.658l3.86 4.73L18.244 3Zm-2.297 16.2h1.702L8.14 4.68H6.33l9.617 14.52Z" />
										</svg>
									),
								},
								{
									name: 'GitHub',
									href: '#',
									icon: (
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5"
											fill="currentColor"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12 2C6.477 2 2 6.486 2 12.02c0 4.432 2.865 8.19 6.839 9.51.5.094.683-.218.683-.486 0-.24-.01-1.04-.015-1.887-2.782.607-3.369-1.19-3.369-1.19-.455-1.158-1.11-1.468-1.11-1.468-.907-.62.069-.607.069-.607 1.003.071 1.53 1.03 1.53 1.03.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.114-4.555-4.957 0-1.095.39-1.99 1.029-2.689-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.027A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.297 2.748-1.027 2.748-1.027.546 1.378.203 2.397.1 2.65.64.699 1.028 1.594 1.028 2.689 0 3.852-2.337 4.701-4.565 4.95.36.31.682.92.682 1.855 0 1.338-.012 2.417-.012 2.747 0 .27.18.584.69.485A9.523 9.523 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
												clipRule="evenodd"
											/>
										</svg>
									),
								},
								{
									name: 'LinkedIn',
									href: '#',
									icon: (
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5"
											fill="currentColor"
											aria-hidden="true"
										>
											<path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1S4.98 2.12 4.98 3.5zM.22 8.99h4.56V24H.22zM8.64 8.99h4.37v2.05h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V24h-4.76v-6.67c0-1.59-.03-3.64-2.22-3.64-2.22 0-2.56 1.73-2.56 3.52V24H8.64z" />
										</svg>
									),
								},
							].map((s) => (
								<a
									key={s.name}
									href={s.href}
									aria-label={s.name}
									className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white hover:bg-white/10"
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					{/* Columns */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
								Company
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Features', to: '/' },
									{ label: 'Pricing', to: '/' },
									{ label: 'Affiliate Program', to: '/' },
									{ label: 'Press Kit', to: '/' },
								].map((i) => (
									<li key={i.label}>
										<Link
											to={i.to}
											className="relative inline-flex items-center text-sm text-white/80 hover:text-white transition"
										>
											<span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
											<span className="group">
												{i.label}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
								Support
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Account', to: '/' },
									{ label: 'Help', to: '/' },
									{ label: 'Contact Us', to: '/' },
									{ label: 'Customer Support', to: '/' },
								].map((i) => (
									<li key={i.label}>
										<Link
											to={i.to}
											className="group relative inline-flex items-center text-sm text-white/80 hover:text-white transition"
										>
											<span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
											<span>{i.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
								Legals
							</h3>
							<ul className="space-y-3">
								{[
									{ label: 'Terms & Conditions', to: '/' },
									{ label: 'Privacy Policy', to: '/' },
									{ label: 'Licensing', to: '/' },
								].map((i) => (
									<li key={i.label}>
										<Link
											to={i.to}
											className="group relative inline-flex items-center text-sm text-white/80 hover:text-white transition"
										>
											<span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full" />
											<span>{i.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row">
					<p>
						© {new Date().getFullYear()} BlogX. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<Link to="/privacy" className="hover:text-white">
							Privacy
						</Link>
						<Link to="/terms" className="hover:text-white">
							Terms
						</Link>
						<a
							href="#top"
							className="inline-flex items-center gap-1 hover:text-white"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M12 5l7 7-1.4 1.4L13 10.8V20h-2v-9.2L6.4 13.4 5 12z" />
							</svg>
							Back to top
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
