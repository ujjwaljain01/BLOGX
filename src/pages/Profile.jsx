import React, { useEffect, useState } from 'react';
import authService from '@/appwrite/auth';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck, Pencil } from 'lucide-react';

export default function Profile() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		authService.getCurrentUser().then((res) => {
			if (res) {
				setUser(res);
				setName(res.name);
			}
			setLoading(false);
		});
	}, []);

	const handleUpdate = async () => {
		try {
			await authService.account.updateName(name);
			setUser((prev) => ({ ...prev, name }));
			setEditMode(false);
		} catch (err) {
			console.error('Update failed', err);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen text-gray-600">
				Loading profile...
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center mt-20 text-gray-500">
				User not logged in
			</div>
		);
	}

	const initials = user.name
		?.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	return (
		<div className="min-h-screen bg-gray-50 py-10 px-4">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6"
			>
				{/* Header */}
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
						{initials}
					</div>

					<div className="flex-1">
						{editMode ? (
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="text-xl font-semibold border-b outline-none w-full"
							/>
						) : (
							<h2 className="text-xl font-bold text-gray-900">
								{user.name}
							</h2>
						)}
						<p className="text-gray-500">{user.email}</p>
					</div>

					<button
						onClick={() => setEditMode(!editMode)}
						className="p-2 rounded-lg hover:bg-gray-100"
					>
						<Pencil size={18} />
					</button>
				</div>

				{/* Info Section */}
				<div className="mt-6 space-y-4 text-gray-700">
					<div className="flex items-center gap-3">
						<User size={18} />
						<span>User ID: {user.$id}</span>
					</div>

					<div className="flex items-center gap-3">
						<Mail size={18} />
						<span>{user.email}</span>
					</div>

					<div className="flex items-center gap-3">
						<ShieldCheck size={18} />
						<span>
							{user.emailVerification ? 'Verified' : 'Unverified'}
						</span>
					</div>

					<div className="flex items-center gap-3">
						<Calendar size={18} />
						<span>
							Joined:{' '}
							{new Date(user.$createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				{/* Save Button */}
				{editMode && (
					<div className="mt-6 text-right">
						<button
							onClick={handleUpdate}
							className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
						>
							Save Changes
						</button>
					</div>
				)}
			</motion.div>
		</div>
	);
}
