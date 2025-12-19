import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Button, RTE, Input, Select } from '../';
import appwriteService from '../../appwrite/config'; // your Service instance
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
			category: post?.category || [], // <-- new
		},
		mode: 'onBlur',
	});
	console.log(getValues);
	const [errorMsg, setErrorMsg] = useState('');
	const [localPreview, setLocalPreview] = useState(null);
	const [categories, setCategories] = useState([]);
	const dropRef = useRef(null);

	// load categories
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
			// require at least one category
			if (!Array.isArray(data.category) || data.category.length === 0) {
				throw new Error(
					'Please choose at least one category for this post.'
				);
			}

			if (post) {
				// update flow
				const file = data?.image?.[0]
					? await appwriteService.uploadFile(data.image[0])
					: null;
				if (file) {
					if (post.featuredImage) {
						// delete old file if present
						try {
							await appwriteService.deleteFile(
								post.featuredImage
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
					// updatePost in your service returns document-like object — use $id or id depending on implementation
					const id = dbPost.$id || dbPost.id || post.$id;
					navigate(`/post/${id}`);
				}
			} else {
				// create flow
				const file = data?.image?.[0]
					? await appwriteService.uploadFile(data.image[0])
					: null;
				if (!file) {
					throw new Error('Please add a featured image.');
				}

				// assemble payload expected by your service.createPost()
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

	// File preview when selecting a new file
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
		const onDrop = (e) => {
			prevent(e);
			const file = e.dataTransfer.files?.[0];
			if (file && /image\/(png|jpe?g|gif)/i.test(file.type)) {
				setValue('image', [file], { shouldValidate: true });
			}
		};
		['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evt) =>
			el.addEventListener(evt, prevent)
		);
		el.addEventListener('drop', onDrop);
		return () => {
			['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evt) =>
				el.removeEventListener(evt, prevent)
			);
			el.removeEventListener('drop', onDrop);
		};
	}, [setValue]);

	const active = useMemo(() => getValues('status') === 'active', [getValues]);

	// category selection helper
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
				{/* Left column */}
				<div className="lg:col-span-2 space-y-6">
					{/* Title + slug card */}
					<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white">
						<div className="flex items-end gap-3">
							<div className="flex-1">
								<label className="mb-2 block text-sm text-white/80">
									Title
								</label>
								<input
									placeholder="Amazing new post"
									className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
									{...register('title', {
										required: 'Title is required',
									})}
								/>
								{errors.title && (
									<p className="mt-2 text-xs text-red-300">
										{errors.title.message}
									</p>
								)}
							</div>
							<span className="select-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
								{titleCount}/100
							</span>
						</div>

						<div className="mt-4">
							<label className="mb-2 block text-sm text-white/80">
								Slug
							</label>
							<input
								placeholder="auto-generated-from-title"
								className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
								{...register('slug', {
									required: 'Slug is required',
								})}
								onInput={(e) =>
									setValue(
										'slug',
										slugTransform(e.currentTarget.value),
										{ shouldValidate: true }
									)
								}
							/>
							<p className="mt-2 text-xs text-white/60">
								URL preview:{' '}
								<span className="text-indigo-300">
									/post/{watch('slug') || 'your-slug'}
								</span>
							</p>
							{errors.slug && (
								<p className="mt-2 text-xs text-red-300">
									{errors.slug.message}
								</p>
							)}
						</div>
					</div>

					{/* Content card */}
					<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white">
						<label className="mb-2 block text-sm text-white/80">
							Content
						</label>
						<RTE
							label=""
							name="content"
							control={control}
							defaultValue={getValues('content')}
						/>
						{errors.content && (
							<p className="mt-2 text-xs text-red-300">
								Content is required
							</p>
						)}
					</div>
				</div>

				{/* Right column */}
				<aside className="lg:col-span-1 lg:sticky lg:top-20 space-y-6">
					{/* Post settings */}
					<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-sm font-medium text-white/90">
								Post settings
							</h3>
							<span
								className={`rounded-full px-2.5 py-1 text-xs ${
									active
										? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20'
										: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/20'
								}`}
							>
								{active ? 'Active' : 'Inactive'}
							</span>
						</div>
						<Select
							options={['active', 'inactive']}
							label="Status"
							className="mb-4"
							{...register('status', { required: true })}
						/>
						<div className="grid grid-cols-2 gap-3">
							<Button type="submit" className="w-full">
								{post ? 'Update' : 'Publish'}
							</Button>
							<button
								type="button"
								className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"
								onClick={() => navigate(-1)}
							>
								Cancel
							</button>
						</div>
						{isSubmitting && (
							<p className="mt-3 text-xs text-white/70">
								Saving…
							</p>
						)}
					</div>

					{/* Categories selector */}
					<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white">
						<label className="mb-2 block text-sm text-white/80">
							Categories
						</label>
						<div className="flex flex-wrap gap-2">
							{categories.map((cat) => {
								const selected = (
									getValues('category') || []
								).includes(cat.$id);
								return (
									<button
										key={cat.$id}
										type="button"
										onClick={() => toggleCategory(cat.$id)}
										className={`px-3 py-1 rounded-full border text-sm transition whitespace-nowrap ${
											selected
												? 'bg-indigo-600 text-white border-indigo-600'
												: 'bg-white/5 border-white/10 text-white/80'
										}`}
									>
										{cat.categoryName ||
											cat.name ||
											cat.slug}
									</button>
								);
							})}
						</div>
						{errors.category && (
							<p className="mt-2 text-xs text-red-300">
								Please select at least one category
							</p>
						)}
						<p className="mt-2 text-xs text-white/60">
							Select one or more categories for this post.
						</p>
					</div>

					{/* Featured image */}
					<div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 text-white">
						<label className="mb-3 block text-sm text-white/80">
							Featured image
						</label>

						<div
							ref={dropRef}
							className="group relative grid place-items-center rounded-xl border border-dashed border-white/20 bg-white/5 p-5 text-center transition hover:border-indigo-400/60"
						>
							<input
								type="file"
								accept="image/png, image/jpg, image/jpeg, image/gif"
								className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
								{...register('image', { required: !post })}
							/>
							<div className="pointer-events-none">
								<svg
									className="mx-auto h-8 w-8 text-white/60"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M19 15v4H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4h-2Zm-7-1 4-4h-3V3h-2v7H8l4 4Z" />
								</svg>
								<p className="mt-2 text-sm text-white/70">
									Drag & drop or click to upload
								</p>
								<p className="text-[11px] text-white/50">
									PNG, JPG, JPEG, GIF
								</p>
							</div>
						</div>
						{errors.image && (
							<p className="mt-2 text-xs text-red-300">
								Featured image is required
							</p>
						)}

						{(localPreview || post) && (
							<div className="mt-4 overflow-hidden rounded-xl border border-white/10">
								<img
									src={
										localPreview ||
										(post
											? appwriteService.getFilePreview(
													post.featuredImage
											  )
											: undefined)
									}
									alt={post?.title || 'Preview'}
									className="h-48 w-full object-cover"
								/>
							</div>
						)}
					</div>

					{/* Error banner */}
					{errorMsg && (
						<div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
							{errorMsg}
						</div>
					)}
				</aside>
			</form>
		</section>
	);
}
