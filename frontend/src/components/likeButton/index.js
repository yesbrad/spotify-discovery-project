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
			<FaHeart />
		</button>
	)
}

export default LikeButton;	