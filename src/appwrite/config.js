import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class Service {
	client = new Client();
	database;
	bucket;

	constructor() {
		this.client
			.setEndpoint(conf.appwriteURL)
			.setProject(conf.appwriteProjectId);
		this.database = new Databases(this.client);
		this.bucket = new Storage(this.client);
	}

	async createPost({
		title,
		slug,
		content,
		featuredImage,
		status,
		userId,
		category,
	}) {
		try {
			return await this.database.createDocument(
				conf.appwriteDatabaseId,
				conf.appwriteArticleId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
					userId,
					category,
				}
			);
		} catch (error) {
			console.log('Appwrite service :: createpsot :: error', error);
		}
	}

	async updatePost(slug, { title, content, featuredImage, status }) {
		try {
			return await this.database.updateDocument(
				conf.appwriteDatabaseId,
				conf.appwriteArticleId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
				}
			);
		} catch (error) {
			console.log('Appwrite service :: updatepost :: error', error);
		}
	}

	async deletePost(slug) {
		try {
			await this.database.deleteDocument(
				conf.appwriteDatabaseId,
				conf.appwriteArticleId,
				slug
			);
			return true;
		} catch (error) {
			console.log('Appwrite service :: deletepost :: error', error);
			return false;
		}
	}

	async getPost(slug) {
		try {
			return await this.database.getDocument(
				conf.appwriteDatabaseId,
				conf.appwriteArticleId,
				slug
			);
		} catch (error) {
			console.log('Appwrite service :: getpost :: error', error);
			return false;
		}
	}

	async getPosts(queries = [Query.equal('status', 'active')]) {
		try {
			return await this.database.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteArticleId,
				queries,
				100,
				0
			);
		} catch (error) {
			console.log('Appwrite service :: getpost :: error', error);
			return false;
		}
	}

	//file upload

	async uploadFile(file) {
		try {
			return await this.bucket.createFile(
				conf.appwriteBucketId,
				ID.unique(),
				file
			);
		} catch (error) {
			console.log('Appwrite service :: getpost :: error', error);
			return false;
		}
	}

	async deleteFile(fileId) {
		try {
			await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
		} catch (error) {
			console.log('Appwrite service :: getpost :: error', error);
			return false;
		}
	}

	getFilePreview(fileId) {
		if (!fileId) return null;
		const id =
			typeof fileId === 'string' ? fileId : fileId?.$id || fileId?.id;
		if (!id) return null;

		// conf.appwriteURL and conf.appwriteBucketId should be defined in your conf file
		// conf.appwriteURL must not have a trailing slash (we normalize elsewhere)
		return `${conf.appwriteURL}/storage/buckets/${conf.appwriteBucketId}/files/${id}/view?project=${conf.appwriteProjectId}`;
	}

	async getCategories(queries = [], limit = 100, offset = 0) {
		try {
			return await this.database.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteCategoryId, // <- set this in conf.js
				queries,
				limit,
				offset
			);
		} catch (error) {
			console.log('Appwrite service :: getCategories :: error', error);
			return false;
		}
	}

	/**
	 * Create a comment
	 * payload: { articleId, content, authorId, parentId? }
	 */
	async createComment({ articleId, content, userId, parentId = null }) {
		try {
			const docId = ID.unique(); // auto id
			const data = {
				articleId,
				content,
				userId,
				parentId,
				edited: false,
			};

			// per-document permissions: public read, only author write
			const permissions = {
				read: ['role:all'],
				write: ['users:' + userId],
			};

			return await this.database.createDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCommentsId, // add this to conf.js
				docId,
				data,
				permissions
			);
		} catch (err) {
			console.error('createComment error', err);
			return false;
		}
	}

	/**
	 * List comments for a post (top-level comments or entire thread)
	 * Uses attribute name: articleId
	 */
	async getCommentsByPost(articleId, queries = [], limit = 100, offset = 0) {
		try {
			if (!articleId) throw new Error('Missing articleId');

			// ensure we pass a string to Appwrite (type must match column type)
			const idValue =
				typeof articleId === 'string' ? articleId : String(articleId);

			// debug log to help if Appwrite complains about invalid query value
			// (keep or remove later)
			// console.debug('getCommentsByPost -> querying articleId =', idValue);

			const q = [Query.equal('articleId', idValue), ...queries];

			return await this.database.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteCommentsId,
				q,
				limit,
				offset
			);
		} catch (err) {
			console.error('getCommentsByPost error', err);
			return false;
		}
	}

	/**
	 * Update a comment (author only)
	 */
	async updateComment(commentId, { content }) {
		try {
			const patch = { content, edited: true };
			return await this.database.updateDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCommentsId,
				commentId,
				patch
			);
		} catch (err) {
			console.error('updateComment error', err);
			return false;
		}
	}

	/**
	 * Delete a comment (author or admin should be allowed client-side)
	 */
	async deleteComment(commentId) {
		try {
			return await this.database.deleteDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCommentsId,
				commentId
			);
		} catch (err) {
			console.error('deleteComment error', err);
			return false;
		}
	}

	subscribeToComments(articleId, handler) {
		const channel = `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCommentsId}.documents`;

		return this.client.subscribe(channel, (response) => {
			const doc = response.payload;
			if (!doc || doc.articleId !== articleId) return;
			handler(response);
		});
	}
}

const service = new Service();

export default service;
