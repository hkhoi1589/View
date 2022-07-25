import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
	AddComment,
	DislikePost,
	EditPost,
	LikePost,
	RemovePost,
	SavePost,
	UnsavePost,
	SET_ADDING_CMT,
} from '../../reducers/postReducer';
import Modal from '../Modal';
import Profile from '../Profile';
import CommentList from '../CommentList';
import UploadComment from '../UploadComment';
import Noti from '../Noti';
import { UploadFile } from '../../helpers';
import './index.scss';

function Post({ _id, index, authorId, profilePicture, username, content, image, heart, comments }) {
	const { authUser, saved } = useSelector((state) => state.authReducer, shallowEqual);
	const dispatch = useDispatch();

	const [isNoti, setIsNoti] = useState(false);
	const [showCmt, setShowCmt] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [isEditPost, setEditPost] = useState(false);
	const [readmore, setReadMore] = useState(true);
	const [cmt, setCmt] = useState('');
	const [text, setText] = useState('');
	const [selectedImage, setSelectedImage] = useState(undefined);

	const handleEditShow = () => {
		setEditPost(!isEditPost);
		setIsNoti(false);
		setText(content);
	};

	const handleEditPost = async () => {
		handleEditShow();
		let imageUrl = image;
		if (selectedImage instanceof File) {
			imageUrl = await UploadFile(selectedImage);
			imageUrl = imageUrl.secure_url;
		}

		setLoading(true);
		await dispatch(EditPost(_id, text, imageUrl));
		setLoading(false);
	};

	const handleLike = async () => {
		await dispatch(LikePost(authUser._id, _id));
	};

	const handleDisLike = async () => {
		await dispatch(DislikePost(authUser._id, _id));
	};

	const handleAddComment = async () => {
		await dispatch(SET_ADDING_CMT(true));
		await dispatch(AddComment(authUser._id, _id, cmt));
		await dispatch(SET_ADDING_CMT(false));
		setCmt('');
	};

	const handleRemovePost = async () => {
		setIsNoti(!isNoti);
		await dispatch(RemovePost(_id));
	};

	const handleSavePost = async () => {
		await dispatch(SavePost(_id, authUser._id));
		setIsNoti(!isNoti);
	};

	const handleUnsavePost = async () => {
		await dispatch(UnsavePost(_id, authUser._id));
		setIsNoti(!isNoti);
	};

	useEffect(() => {
		if (_id !== '' && authorId !== '' && profilePicture !== '' && username !== '') {
			setLoading(false);
			setText(content);
			setSelectedImage(image);
		}
	}, [_id, authorId, profilePicture, username, content, image]);

	return (
		<>
			<article className='post'>
				<div className='post_container container flex-column-between'>
					<div className='post_content'>
						<div className='flex-between'>
							<Profile id={authorId}>
								<Profile.Img img={profilePicture} />
								<Profile.Name>{username}</Profile.Name>
							</Profile>
							<Noti isEdit={true} isNoti={isNoti} setIsNoti={setIsNoti}>
								<li>
									{saved.every((post) => post._id !== _id) ? (
										<Noti.NotiLink
											isEdit={true}
											handleClick={() => handleSavePost()}>
											Save Post
										</Noti.NotiLink>
									) : (
										<Noti.NotiLink
											isEdit={true}
											handleClick={() => handleUnsavePost()}>
											Unsave Post
										</Noti.NotiLink>
									)}
								</li>
								{authorId === authUser._id && (
									<>
										<li>
											<Noti.NotiLink
												isEdit={true}
												handleClick={() => handleEditShow()}>
												Edit
											</Noti.NotiLink>
										</li>
										<li>
											<Noti.NotiLink
												isEdit={true}
												handleClick={() => handleRemovePost()}>
												Remove
											</Noti.NotiLink>
										</li>
									</>
								)}
							</Noti>
						</div>
						<div className='post_info'>
							{isLoading ? (
								<div className='loading-content loading-post'></div>
							) : content.length > 200 ? (
								<p>
									{readmore ? `${content.substring(0, 200)}...` : content}
									<button onClick={() => setReadMore(!readmore)}>
										{readmore ? 'Read more' : 'Show less'}
									</button>
								</p>
							) : (
								<p>{content}</p>
							)}
						</div>
					</div>
					{isLoading ? (
						<div className='post_img loading-post'></div>
					) : (
						image && <img className='post_img' src={image} alt='post.png' srcSet='' />
					)}
					<footer className='flex-between'>
						{heart.some((liker) => liker === authUser._id) ? (
							<button
								type='button'
								className='btn post_like'
								onClick={() => handleDisLike()}>
								<i className='fa-solid fa-heart'></i>
								<p>{heart.length}</p>
							</button>
						) : (
							<button type='button' className='btn' onClick={() => handleLike()}>
								<i className='fa-solid fa-heart'></i>
								<p>{heart.length}</p>
							</button>
						)}

						<button type='button' className='btn' onClick={() => setShowCmt(!showCmt)}>
							<i className='fa-solid fa-message'></i>
							<p>{comments.length}</p>
						</button>
					</footer>
					{showCmt && <CommentList comments={comments} postId={_id} />}
					<UploadComment
						index={index}
						_id={authUser._id}
						profilePicture={profilePicture}
						text={cmt}
						setText={setCmt}
						handleClick={() => handleAddComment()}
					/>
				</div>
			</article>

			<Modal isShow={isEditPost} handleShow={handleEditShow}>
				<Modal.Header>Edit post</Modal.Header>
				<div className='container'>
					<Modal.Body>
						<Profile id={_id}>
							<Profile.Img img={profilePicture} />
							<Profile.Name>{username}</Profile.Name>
						</Profile>
						<Modal.Content>
							<Modal.TextArea text={text} setText={setText}>
								Write something...
							</Modal.TextArea>
							{selectedImage && (
								<Modal.Preview
									selectedImage={selectedImage}
									setSelectedImage={setSelectedImage}
								/>
							)}
						</Modal.Content>
					</Modal.Body>
					<Modal.Footer>
						<Modal.UploadFile
							setSelectedImage={setSelectedImage}
							id={`editPostFile-${index}`}>
							Image
						</Modal.UploadFile>
						<Modal.UploadBtn handleClick={() => handleEditPost()}>Save</Modal.UploadBtn>
					</Modal.Footer>
				</div>
			</Modal>
		</>
	);
}

export default memo(Post);
