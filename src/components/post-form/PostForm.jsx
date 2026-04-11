import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Button, RTE, Input, Select } from '../';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Type,
	Link as LinkIcon,
	FileText,
	Settings,
	Tag,
	Upload,
	Image as ImageIcon,
	AlertCircle,
	CheckCircle,
	X,
	Save,
	Eye,
	Sparkles,
} from 'lucide-react';

export default function Postform({ post }) {
	const navigate = useNavigate();
	const userData = useSelector((state) => state.auth.userData);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			title: post?.title || '',
			slug: post?.slug || '',
			content: post?.content || '',
			status: post?.status || 'active',
			image: undefined,
			category: post?.category || [],
		},
		mode: 'onBlur',
	});

	const [errorMsg, setErrorMsg] = useState('');
	const [localPreview, setLocalPreview] = useState(null);
	const [categories, setCategories] = useState([]);
	const [isDragging, setIsDragging] = useState(false);
	const dropRef = useRef(null);

	// Load categories
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await appwriteService.getCategories();
				if (!mounted) return;
				setCategories(res?.documents || []);
			} catch (e) {
				console.error('Failed to load categories', e);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const submit = async (data) => {
		setErrorMsg('');
		try {
			if (!Array.isArray(data.category) || data.category.length === 0) {
				throw new Error(
					'Please choose at least one category for this post.',
				);
			}

			if (post) {
				const file = data?.image?.[0]
					? await appwriteService.uploadFile(data.image[0])
					: null;
				if (file) {
					if (post.featuredImage) {
						try {
							await appwriteService.deleteFile(
								post.featuredImage,
							);
						} catch (e) {
							console.warn('Failed to delete previous file', e);
						}
					}
				}

				const dbPost = await appwriteService.updatePost(post.$id, {
					title: data.title,
					slug: data.slug,
					content: data.content,
					featuredImage: file ? file.$id : post.featuredImage,
					status: data.status,
					category: data.category,
				});

				if (dbPost) {
					const id = dbPost.$id || dbPost.id || post.$id;
					navigate(`/post/${id}`);
				}
			} else {
				const file = data?.image?.[0]
					? await appwriteService.uploadFile(data.image[0])
					: null;
				if (!file) {
					throw new Error('Please add a featured image.');
				}

				const payload = {
					title: data.title,
					slug: data.slug,
					content: data.content,
					featuredImage: file.$id,
					status: data.status,
					userId: userData?.$id,
					category: data.category,
				};

				const dbPost = await appwriteService.createPost(payload);
				if (dbPost) {
					const id = dbPost.$id || dbPost.id;
					navigate(`/post/${id}`);
				}
			}
		} catch (e) {
			setErrorMsg(e?.message || 'Something went wrong');
		}
	};

	const slugTransform = useCallback((value) => {
		if (value && typeof value === 'string') {
			return value
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '-')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-');
		}
		return '';
	}, []);

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name !== 'title') return;
			const newSlug = slugTransform(value?.title || '');
			const currentSlug = getValues('slug');
			if (newSlug !== currentSlug) {
				setValue('slug', newSlug, { shouldValidate: true });
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, slugTransform, setValue, getValues]);

	// File preview
	const imageWatch = watch('image');
	useEffect(() => {
		if (imageWatch && imageWatch[0]) {
			const url = URL.createObjectURL(imageWatch[0]);
			setLocalPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setLocalPreview(null);
	}, [imageWatch]);

	const titleValue = watch('title', '');
	const titleCount = titleValue.length;

	// Drag & drop handlers
	useEffect(() => {
		const el = dropRef.current;
		if (!el) return;
		const prevent = (e) => {
			e.preventDefault();
			e.stopPropagation();
		};
		const onDragEnter = (e) => {
			prevent(e);
			setIsDragging(true);
		};
		const onDragLeave = (e) => {
			prevent(e);
			setIsDragging(false);
		};
		const onDrop = (e) => {
			prevent(e);
			setIsDragging(false);
			const file = e.dataTransfer.files?.[0];
			if (file && /image\/(png|jpe?g|gif)/i.test(file.type)) {
				setValue('image', [file], { shouldValidate: true });
			}
		};
		['dragenter', 'dragover'].forEach((evt) =>
			el.addEventListener(evt, prevent),
		);
		el.addEventListener('dragenter', onDragEnter);
		el.addEventListener('dragleave', onDragLeave);
		el.addEventListener('drop', onDrop);
		return () => {
			['dragenter', 'dragover'].forEach((evt) =>
				el.removeEventListener(evt, prevent),
			);
			el.removeEventListener('dragenter', onDragEnter);
			el.removeEventListener('dragleave', onDragLeave);
			el.removeEventListener('drop', onDrop);
		};
	}, [setValue]);

	const active = useMemo(() => getValues('status') === 'active', [getValues]);

	const toggleCategory = (id) => {
		const current = getValues('category') || [];
		if (current.includes(id)) {
			const next = current.filter((x) => x !== id);
			setValue('category', next, { shouldValidate: true });
		} else {
			const next = [...current, id];
			setValue('category', next, { shouldValidate: true });
		}
	};

	return (
		<section className="relative">
			<form
				onSubmit={handleSubmit(submit)}
				className="grid grid-cols-1 gap-6 lg:grid-cols-3"
			>
				{/* Left Column - Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Title & Slug Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-6"
					>
						<div className="flex items-end gap-3 mb-4">
							<div className="flex-1">
								<label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#111827]">
									<Type className="w-4 h-4 text-[#2563EB]" />
									Title
								</label>
								<input
									placeholder="Amazing new post"
									className="w-full rounded-lg bg-[#F9FAFB] border text-sm border-[#E5E7EB] px-4 py-3 text-[#111827] placeholder-[#6B7280] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
									{...register('title', {
										required: 'Title is required',
									})}
								/>
								{errors.title && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="mt-2 text-xs text-red-600"
									>
										{errors.title.message}
									</motion.p>
								)}
							</div>
							<span className="select-none rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs font-medium text-[#6B7280]">
								{titleCount}/100
							</span>
						</div>

						<div>
							<label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#111827]">
								<LinkIcon className="w-4 h-4 text-[#2563EB]" />
								Slug
							</label>
							<input
								placeholder="auto-generated-from-title"
								className="w-full rounded-lg text-sm bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 text-[#111827] placeholder-[#6B7280] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
								{...register('slug', {
									required: 'Slug is required',
								})}
								onInput={(e) =>
									setValue(
										'slug',
										slugTransform(e.currentTarget.value),
										{ shouldValidate: true },
									)
								}
							/>
							<p className="mt-2 text-xs text-[#6B7280]">
								URL preview:{' '}
								<span className="font-medium text-[#2563EB]">
									/post/{watch('slug') || 'your-slug'}
								</span>
							</p>
							{errors.slug && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="mt-2 text-xs text-red-600"
								>
									{errors.slug.message}
								</motion.p>
							)}
						</div>
					</motion.div>

					{/* Content Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-6"
					>
						<label className="mb-3 flex items-center gap-2 text-xs font-medium text-[#111827]">
							<FileText className="w-4 h-4 text-[#2563EB]" />
							Content
						</label>
						<RTE
							label=""
							name="content"
							control={control}
							defaultValue={getValues('content')}
						/>
						{errors.content && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-2 text-xs text-red-600"
							>
								Content is required
							</motion.p>
						)}
					</motion.div>
				</div>

				{/* Right Column - Sidebar */}
				<aside className="lg:col-span-1 lg:sticky lg:top-20 space-y-6">
					{/* Post Settings Card */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-6"
					>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
								<Settings className="w-4 h-4 text-[#2563EB]" />
								Post Settings
							</h3>
							<motion.span
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
									active
										? 'bg-green-50 text-green-700 border border-green-200'
										: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
								}`}
							>
								{active ? (
									<>
										<CheckCircle className="w-3 h-3" />
										Active
									</>
								) : (
									<>
										<Eye className="w-3 h-3" />
										Draft
									</>
								)}
							</motion.span>
						</div>

						<div className="mb-4">
							<label className="mb-2 block text-xs font-medium text-[#111827]">
								Status
							</label>
							<select
								className="w-full text-sm rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
								{...register('status', { required: true })}
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={isSubmitting}
								className="flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-60"
							>
								<Save className="w-4 h-4" />
								{post ? 'Update' : 'Publish'}
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								onClick={() => navigate(-1)}
								className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
							>
								<X className="w-4 h-4" />
								Cancel
							</motion.button>
						</div>

						{isSubmitting && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-3 text-xs text-[#6B7280] flex items-center gap-2"
							>
								<span className="inline-block w-3 h-3 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
								Saving…
							</motion.p>
						)}
					</motion.div>

					{/* Categories Card */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-6"
					>
						<label className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#111827]">
							<Tag className="w-4 h-4 text-[#2563EB]" />
							Categories
						</label>
						<div className="flex flex-wrap gap-2">
							{categories.map((cat) => {
								const selected = (
									getValues('category') || []
								).includes(cat.$id);
								return (
									<motion.button
										key={cat.$id}
										type="button"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => toggleCategory(cat.$id)}
										className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition whitespace-nowrap ${
											selected
												? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
												: 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
										}`}
									>
										{cat.categoryName ||
											cat.name ||
											cat.slug}
									</motion.button>
								);
							})}
						</div>
						{errors.category && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-2 text-xs text-red-600"
							>
								Please select at least one category
							</motion.p>
						)}
						<p className="mt-2 text-xs text-[#6B7280]">
							Select one or more categories for this post.
						</p>
					</motion.div>

					{/* Featured Image Card */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-6"
					>
						<label className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#111827]">
							<ImageIcon className="w-4 h-4 text-[#2563EB]" />
							Featured Image
						</label>

						<div
							ref={dropRef}
							className={`group relative grid place-items-center rounded-lg border-2 border-dashed p-6 text-center transition ${
								isDragging
									? 'border-[#2563EB] bg-blue-50'
									: 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#2563EB] hover:bg-blue-50'
							}`}
						>
							<input
								type="file"
								accept="image/png, image/jpg, image/jpeg, image/gif"
								className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
								{...register('image', { required: !post })}
							/>
							<div className="pointer-events-none">
								<Upload className="mx-auto h-8 w-8 text-[#6B7280] group-hover:text-[#2563EB] transition" />
								<p className="mt-2 text-xs font-medium text-[#111827]">
									Drag & drop or click to upload
								</p>
								<p className="text-xs text-[#6B7280]">
									PNG, JPG, JPEG, GIF
								</p>
							</div>
						</div>

						{errors.image && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-2 text-xs text-red-600"
							>
								Featured image is required
							</motion.p>
						)}

						<AnimatePresence>
							{(localPreview || post) && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									className="mt-4 relative overflow-hidden rounded-lg border border-[#E5E7EB]"
								>
									<img
										src={
											localPreview ||
											(post
												? appwriteService.getFilePreview(
														post.featuredImage,
													)
												: undefined)
										}
										alt={post?.title || 'Preview'}
										className="h-48 w-full object-cover"
									/>
									<div className="absolute top-2 right-2">
										<span className="inline-flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-[#111827] shadow-sm">
											<Sparkles className="w-3 h-3 text-[#2563EB]" />
											Preview
										</span>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Error Banner */}
					<AnimatePresence>
						{errorMsg && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3"
							>
								<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
								<p className="text-xs text-red-800">
									{errorMsg}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</aside>
			</form>
		</section>
	);
}
