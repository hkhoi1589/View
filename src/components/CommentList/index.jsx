import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Comment from '../Comment';

function CommentList({ comments, postId }) {
	const { isAddingCmt } = useSelector((state) => state.postReducer, shallowEqual);
	return (
		<ul className='comment-list'>
			{comments.map(({ _id, user, text }, index) => (
				<li key={`comment-${index}`}>
					<Comment _id={_id} user={user} text={text} postId={postId} index={index} />
				</li>
			))}
			{isAddingCmt && <Comment _id='' user='' text='' postId={postId} />}
		</ul>
	);
}

export default CommentList;
