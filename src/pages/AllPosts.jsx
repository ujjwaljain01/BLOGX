import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';

export default function AllPosts() {
	const [post, setPosts] = useState([]);
	useEffect(() => {
		appwriteService.getPosts([]).then((posts) => {
			if (posts) {
				setPosts(posts.documents);
			}
			console.log(posts);
		});
	}, []);

	return (
		<div className="w-full py-8">
			<Container>
				<div className="flex flex-wrap">
					{post.map((post) => (
						<div key={post.$id} className="w-1/4 p-2">
							<PostCard {...post} />
						</div>
					))}
				</div>
			</Container>
		</div>
	);
}
