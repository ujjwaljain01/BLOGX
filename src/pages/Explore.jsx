import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { motion } from 'framer-motion';
import { Layers, Code, PenTool, BookOpen } from 'lucide-react';
import Post from './Post';

export default function Explore() {
	const [categories, setCategories] = useState([]);
	const [posts, setPosts] = useState([]);
	const [activeCat, setActiveCat] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await appwriteService.getCategories();
				console.log('Fetched categories:', res);

				if (res?.documents) {
					setCategories(res.documents);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const fetchPostsByCategory = async (category) => {
		setActiveCat(category);
		setLoading(true);
		const res = await appwriteService.getPostsByCategory(category);

		if (res) {
			setPosts(res.documents);
		}
		console.log(posts);
		setLoading(false);
	};

	// Optional icon mapping
	const getIcon = (name) => {
		if (!name) return <Layers />; // fallback icon

		switch (name.toLowerCase()) {
			case 'tech':
				return <Code />;
			case 'lifestyle':
				return <PenTool />;
			case 'self-improvement':
				return <BookOpen />;
			default:
				return <Layers />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<Container>
				{/* Header */}
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold text-gray-900">
						Explore Categories
					</h1>
					<p className="text-gray-600 mt-2">
						Browse posts by your interests 🚀
					</p>
				</div>

				{/* Categories */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
					{categories.map((cat) => (
						<motion.div
							key={cat.$id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								fetchPostsByCategory(cat.categoryName)
							}
							className={`cursor-pointer p-4 rounded-xl border transition ${
								activeCat === cat.categoryName
									? 'bg-blue-600 text-white border-blue-600'
									: 'bg-white hover:bg-gray-100'
							}`}
						>
							<div className="flex flex-col items-center gap-2">
								<div className="text-xl">
									{getIcon(cat.categoryName)}
								</div>
								<p className="font-medium">
									{cat.categoryName}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Posts Section */}
				{loading ? (
					<div className="text-center text-gray-600">
						Loading posts...
					</div>
				) : posts.length === 0 ? (
					<div className="text-center text-gray-500">
						Select a category to view posts 👆
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{posts.map((post) => (
							<PostCard key={post.$id} {...post} />
						))}
					</div>
				)}
			</Container>
		</div>
	);
}
