import React from 'react';
import { motion } from 'framer-motion';

// Dark Fusion - Single-file React landing page (Tailwind CSS required)
// NOTE: Replaced external `lucide-react` imports with local inline SVG icon components
// to avoid CDN / bundler fetch issues in restricted environments.

const LightningIcon = (props) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
	</svg>
);

const SunIcon = (props) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
	</svg>
);

const MoonIcon = (props) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
	</svg>
);

const MailIcon = (props) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M3 8l9 6 9-6" />
		<path d="M21 19H3a2 2 0 01-2-2V7a2 2 0 012-2h18a2 2 0 012 2v10a2 2 0 01-2 2z" />
	</svg>
);

// Export a tiny object that can be used by tests to check the presence of icons/components.
export const __TEST__ = {
	icons: ['LightningIcon', 'SunIcon', 'MoonIcon', 'MailIcon'],
};

export default function Landing() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 antialiased">
			{/* Top nav */}
			<nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/30 via-violet-400/25 to-pink-400/20 backdrop-blur-sm shadow-lg flex items-center justify-center ring-1 ring-white/5">
						<LightningIcon
							className="w-5 h-5 text-cyan-300"
							aria-hidden
						/>
					</div>
					<span className="font-semibold tracking-wide text-lg">
						DarkFusion
					</span>
				</div>

				<div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
					<a className="hover:text-white transition">Features</a>
					<a className="hover:text-white transition">Pricing</a>
					<a className="hover:text-white transition">Docs</a>
					<button className="px-3 py-1 rounded-md border border-white/10 text-gray-200 hover:scale-105 transform transition">
						Sign in
					</button>
				</div>

				<div className="md:hidden">
					<button
						className="p-2 rounded-md hover:bg-white/5"
						aria-label="menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</nav>

			{/* Hero */}
			<header className="max-w-6xl mx-auto px-6 py-14">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					<motion.div
						initial={{ x: -40, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.7 }}
					>
						<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
							Build a{' '}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300">
								futuristic
							</span>{' '}
							blog experience
						</h1>
						<p className="mt-4 text-gray-300 max-w-xl">
							DarkFusion is a sleek, neon-accented theme ideal for
							tech writers, AI blogs and creators who want a
							modern, immersive reading experience. Fast,
							accessible, and gorgeous in both light and dark
							modes.
						</p>

						<div className="mt-6 flex gap-4">
							<a
								href="#"
								className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500/90 to-violet-500/80 shadow-lg hover:scale-105 transform transition"
							>
								<span className="font-medium">Get Started</span>
							</a>
							<a
								href="#features"
								className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/10 text-sm hover:bg-white/3 transition"
							>
								Live demo
							</a>
						</div>

						<div className="mt-8 flex items-center gap-3 text-xs text-gray-400">
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-cyan-400 shadow-md" />
								<span>Real-time syntax highlighting</span>
							</div>
							<div className="flex items-center gap-2 ml-6">
								<span className="w-2 h-2 rounded-full bg-violet-400 shadow-md" />
								<span>Estimated read time & focus mode</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.7 }}
						className="relative"
					>
						<div className="rounded-2xl p-6 bg-gradient-to-br from-white/2 to-white/3 ring-1 ring-white/5 backdrop-blur-sm shadow-2xl">
							<div className="flex items-center justify-between">
								<div>
									<div className="text-xs text-gray-400">
										Featured
									</div>
									<div className="mt-2 text-lg font-semibold">
										The AI that writes for you
									</div>
								</div>
								<div className="text-sm text-gray-400">
									5 min read
								</div>
							</div>

							<div className="mt-4 bg-gradient-to-b from-black/60 to-transparent rounded-xl p-4 ring-1 ring-white/5">
								<p className="prose prose-invert max-w-none text-sm">
									"Design systems are the backbone of
									delightful, consistent product experiences —
									here's how we approached ours for a
									neon-forward UI."
								</p>
							</div>

							<div className="mt-4 flex items-center gap-3">
								<img
									src="https://images.unsplash.com/photo-1547721064-da6cfb341d50?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder"
									alt="author"
									className="w-10 h-10 rounded-full ring-1 ring-white/6"
								/>
								<div className="text-sm">
									<div className="font-medium">A. Nova</div>
									<div className="text-gray-400 text-xs">
										Nov 8 • 2025
									</div>
								</div>
							</div>
						</div>

						{/* Neon glow accent */}
						<div
							className="absolute -right-12 -bottom-10 w-56 h-56 rounded-full blur-3xl opacity-60 bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-400/70"
							aria-hidden
						/>
					</motion.div>
				</div>
			</header>

			{/* Features */}
			<section id="features" className="max-w-6xl mx-auto px-6 py-12">
				<h3 className="text-sm text-cyan-300 font-semibold">
					Why DarkFusion
				</h3>
				<h2 className="mt-2 text-2xl sm:text-3xl font-bold">
					Packed with modern features
				</h2>

				<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{[
						{
							title: 'Neon accents',
							desc: 'Customizable neon color accents and glows.',
						},
						{
							title: 'Focus Mode',
							desc: 'Distraction-free reading view with minimal chrome.',
						},
						{
							title: 'Fast & Accessible',
							desc: 'A11y-minded structure and blazing performance.',
						},
						{
							title: 'Powered by React',
							desc: 'Component-first architecture for extensibility.',
						},
					].map((f) => (
						<motion.div
							key={f.title}
							whileHover={{ y: -6 }}
							className="p-5 rounded-2xl bg-gradient-to-t from-white/3 to-transparent ring-1 ring-white/5 backdrop-blur-sm"
						>
							<div className="text-cyan-300 text-sm font-semibold">
								{f.title}
							</div>
							<div className="mt-2 text-sm text-gray-300">
								{f.desc}
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Newsletter / CTA */}
			<section className="max-w-5xl mx-auto px-6 py-12">
				<div className="rounded-2xl p-8 bg-gradient-to-br from-white/4 to-transparent ring-1 ring-white/6 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
					<div className="flex-1">
						<h3 className="text-xl font-bold">Stay in the loop</h3>
						<p className="mt-2 text-gray-300">
							Get the latest themes, UI tips and release notes. No
							spam — just shiny neon updates.
						</p>
					</div>
					<form
						className="flex gap-3 w-full md:w-auto"
						onSubmit={(e) => e.preventDefault()}
					>
						<input
							aria-label="email"
							placeholder="you@domain.com"
							className="px-4 py-3 rounded-lg bg-black/40 ring-1 ring-white/6 placeholder-gray-400 outline-none"
						/>
						<button
							className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 shadow-md"
							type="submit"
						>
							<MailIcon className="w-4 h-4" aria-hidden />
							<span>Subscribe</span>
						</button>
					</form>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-12 border-t border-white/6">
				<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/30 via-violet-400/25 to-pink-400/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/5">
							<LightningIcon
								className="w-4 h-4 text-cyan-300"
								aria-hidden
							/>
						</div>
						<div className="text-sm text-gray-300">
							© {new Date().getFullYear()} DarkFusion — Crafted
							for creators
						</div>
					</div>

					<div className="flex items-center gap-4 text-sm text-gray-400">
						<a className="hover:text-white transition">Privacy</a>
						<a className="hover:text-white transition">Terms</a>
						<div className="hidden md:flex items-center gap-2">
							<SunIcon className="w-4 h-4" aria-hidden />
							<MoonIcon className="w-4 h-4" aria-hidden />
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
