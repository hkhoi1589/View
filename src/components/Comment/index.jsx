import React, { useState, memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { EditComment, RemoveComment } from '../../reducers/postReducer';
import { Link } from 'react-router-dom';
import Noti from '../Noti';
import Profile from '../Profile';
import UploadComment from '../UploadComment';
import './index.scss';

function Comment({ _id, user, text, postId, index }) {
	const { authUser } = useSelector((state) => state.authReducer, shallowEqual);
	const dispatch = useDispatch();

	const [isLoading, setLoading] = useState(true);
	const [newText, setNewText] = useState('');
	const [isNotiCmt, setIsNotiCmt] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [readmore, setReadMore] = useState(true);

	const handleEditComment = async () => {
		setIsEdit(!isEdit);
		setLoading(true);
		await dispatch(EditComment(_id, postId, newText));
		setLoading(false);
	};

	const handleEdit = () => {
		setIsEdit(!isEdit);
		setIsNotiCmt(!isNotiCmt);
	};

	const handleRemoveComment = async () => {
		setIsNotiCmt(!isNotiCmt);
		await dispatch(RemoveComment(_id, postId));
	};

	useEffect(() => {
		if (_id !== '' && user !== '' && text !== '') {
			setLoading(false);
			setNewText(text);
		}
	}, [_id, user, text]);

	return (
		<article className='comment'>
			{isEdit ? (
				<UploadComment
					index={index}
					_id={_id}
					profilePicture={user.profilePicture}
					text={newText}
					setText={setNewText}
					handleClick={() => handleEditComment()}
				/>
			) : (
				<>
					<Link to={`/person/${_id}`}>
						<Profile.Img img={user.profilePicture} />
					</Link>
					<div className='comment_text'>
						<Link to={`/person/${_id}`}>
							<Profile.Name>{user.username}</Profile.Name>
						</Link>
						{isLoading ? (
							<div className='loading-content loading-post'></div>
						) : text.length > 200 ? (
							<p>
								{readmore ? `${text.substring(0, 200)}...` : text}
								<button
									className='comment_readmore'
									onClick={() => setReadMore(!readmore)}>
									{readmore ? 'Read more' : 'Show less'}
								</button>
							</p>
						) : (
							<p>{text}</p>
						)}
					</div>

					{user._id === authUser._id && ( // cmt cua authUser
						<Noti isEdit={true} isNoti={isNotiCmt} setIsNoti={setIsNotiCmt}>
							<li>
								<Noti.NotiLink isEdit={true} handleClick={() => handleEdit()}>
									Edit
								</Noti.NotiLink>
							</li>
							<li>
								<Noti.NotiLink
									isEdit={true}
									handleClick={() => handleRemoveComment()}>
									Remove
								</Noti.NotiLink>
							</li>
						</Noti>
					)}
				</>
			)}
		</article>
	);
}

export default memo(Comment);
