import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import Profile from '../Profile';
import './index.scss';

function UploadComment({ index, _id, profilePicture, text, setText, handleClick }) {
	const textAreaAdjust = (element) => {
		element.style.height = '40px';
		element.style.height = element.scrollHeight + 'px';
	};

	return (
		<article className='upload-comment flex-between'>
			<label htmlFor={`comment-${index}`} className='upload-comment_content flex-between'>
				<Link to={`/person/${_id}`}>
					<Profile.Img img={profilePicture} />
				</Link>
				<Modal.TextArea
					text={text}
					id='upload-post'
					setText={setText}
					resize={(e) => textAreaAdjust(e.target)}>
					Write a comment...
				</Modal.TextArea>
			</label>
			<button
				type='button'
				title='comment-post'
				className='upload-comment_button'
				onClick={handleClick}>
				<i className='fa-solid fa-circle-arrow-right'></i>
			</button>
		</article>
	);
}

export default memo(UploadComment);
