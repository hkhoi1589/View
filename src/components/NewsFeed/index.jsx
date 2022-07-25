import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Loading from '../Loading';
import Post from '../Post';

let defaultData = [];
for (let i = 0; i < 10; i++) {
	defaultData.push({ _id: '', author: '', text: '', comments: [], likers: [], file: '' });
}

function NewsFeed({ data = defaultData, isFetching }) {
	const { isAddingPost } = useSelector((state) => state.postReducer, shallowEqual);
	return (
		<section>
			<ul>
				{isAddingPost && (
					<Post
						_id=''
						authorId=''
						profilePicture=''
						username=''
						content=''
						image=''
						heart={[]}
						comments={[]}
					/>
				)}
				{data.map(({ _id, author, text, comments, likers, file }, index) => (
					<li key={index}>
						<Post
							_id={_id}
							authorId={author._id}
							profilePicture={author.profilePicture}
							username={author.username}
							index={index}
							content={text}
							image={file}
							heart={likers}
							comments={comments}
						/>
					</li>
				))}
			</ul>
			{isFetching && <Loading.Post />}
		</section>
	);
}

export default NewsFeed;
