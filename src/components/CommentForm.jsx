// components/CommentForm.jsx
import React, { useState } from 'react';
import service from '../appwrite/config';
import authService from '../appwrite/auth';

export default function CommentForm({ articleId, onPosted }) {
	const [content, setContent] = useState('');
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState('');

	const submit = async (e) => {
		e.preventDefault();
		setErr('');
		if (!content.trim()) return setErr('Please type a comment.');

		try {
			setSaving(true);
			const user = await authService.getCurrentUser();
			if (!user) throw new Error('You must be logged in to comment');

			const res = await service.createComment({
				articleId,
				content: content.trim(),
				userId: user.$id,
			});

			setContent('');
			if (onPosted) onPosted(res); // parent can refresh
		} catch (e) {
			setErr(e?.message || 'Failed to post comment');
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={submit} className="space-y-2">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write a thoughtful comment..."
				className="w-full rounded border p-2 bg-white/5 text-white"
				rows={3}
			/>
			{err && <p className="text-xs text-red-300">{err}</p>}
			<div className="flex gap-2">
				<button
					type="submit"
					disabled={saving}
					className="rounded bg-indigo-600 px-3 py-1 text-sm"
				>
					{saving ? 'Posting…' : 'Post comment'}
				</button>
			</div>
		</form>
	);
}
