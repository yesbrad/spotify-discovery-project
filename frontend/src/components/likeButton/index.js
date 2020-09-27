import React from 'react';
import './index.scss';
import { FaHeart } from 'react-icons/fa';
import { likeSong } from '../../api/player';

const LikeButton = ({ id }) => {
	const onLike = () => {
		likeSong(id);
	}

	return (
		<button className="like-container" onClick={onLike}>
			<FaHeart className="like-container-icon"/>
		</button>
	)
}

export default LikeButton;	