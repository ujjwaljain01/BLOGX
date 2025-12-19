	const conf = {
		appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
		appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
		appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
		appwriteArticleId: String(import.meta.env.VITE_APPWRITE_ARTICLE_ID),
		appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
		appwriteCategoryId: String(import.meta.env.VITE_APPWRITE_CATEGORY_ID),
		appwriteCommentsId: String(import.meta.env.VITE_APPWRITE_COMMENTS_ID),
		appwriteProfileId: String(import.meta.env.VITE_APPWRITE_PROFILE_ID),
	};
	export default conf;
