import React from 'react';
import { Container } from '../components';
import Postform from '../components/post-form/PostForm';

export default function AddPost() {
	return (
		<>
			<div className="py-8">
				{' '}
				<Container>
					<Postform />
				</Container>
			</div>
		</>
	);
}
