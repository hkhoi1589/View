import React from 'react';
import svg from './Double Ring-1s-200px.svg';
import './index.scss';

function Loading() {
	return (
		<article className='loading loading--full flex-center-center'>
			<img src={svg} alt='loading.svg' />
		</article>
	);
}

Loading.Post = () => (
	<article className='loading loading--post flex-center-center'>
		<img src={svg} alt='loading.svg' />
	</article>
);

export default Loading;
