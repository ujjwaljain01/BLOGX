import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import Post from './Post';

export default function Explore() {
	const [categories, setCategories] = useState([]);
	const [posts, setPosts] = useState([]);
	const [activeCat, setActiveCat] = useState([]);
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

	const handleCategoryToggle = (categoryId) => {
		setActiveCat((prev) => {
			if (prev.includes(categoryId)) {
				return prev.filter((id) => id !== categoryId);
			} else {
				return [...prev, categoryId];
			}
		});
	};

	useEffect(() => {
		const fetchPosts = async () => {
			if (activeCat.length === 0) {
				setPosts([]);
				return;
			}

			setLoading(true);
			try {
				const res =
					await appwriteService.getPostsByCategories(activeCat);
				if (res?.documents) {
					setPosts(res.documents);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [activeCat]);

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<Container>
				{/* Header */}
				<div className="mb-10">
					<div className="flex items-center gap-2 mb-2">
						<Icons.Compass className="text-blue-400" size={28} />
						<h1 className="text-3xl font-bold text-gray-900">
							Explore Categories
						</h1>
					</div>
					<p className="text-gray-600 mt-2">
						Browse posts by your interests 🚀
					</p>
				</div>

				{/* Categories */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
					{categories.map((cat) => {
						const Icon = Icons[cat.icon] || Icons.HelpCircle;

						return (
							<motion.div
								key={cat.$id}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleCategoryToggle(cat.$id)}
								className={`cursor-pointer p-2 text-center md:p-6 rounded-xl border transition ${
									activeCat.includes(cat.$id)
										? 'bg-blue-600 text-white border-blue-600'
										: 'bg-white hover:border-blue-600'
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<div className="text-xl">
										<Icon size={20}></Icon>
									</div>
									<p className="font-medium text-sm">
										{cat.categoryName}
									</p>
								</div>
							</motion.div>
						);
					})}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className=" cursor-pointer p-2 text-center  md:p-6 rounded-xl border bg-white hover:border-blue-600"
						onClick={() => {
							setActiveCat([]);
							setPosts([]);
						}}
					>
						{' '}
						<div className="flex flex-col items-center justify-center gap-2">
							<div>
								<Icons.Trash size={20}></Icons.Trash>
							</div>
							<div className="font-medium text-sm">
								Clear All Categories
							</div>
						</div>
					</motion.div>
				</div>

				{/* Posts Section */}
				{loading ? (
					<div className="text-center text-gray-600">
						Loading posts...
					</div>
				) : posts.length === 0 && activeCat.length === 0 ? (
					<div className="text-center text-gray-500">
						Select a category to view posts 👆
					</div>
				) : posts.length === 0 ? (
					<div className="text-center text-gray-500">
						There are no posts of this category
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
