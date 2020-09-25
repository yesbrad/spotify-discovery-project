import React, { useState } from 'react';
import './index.scss';
import Button from '../button';
import LikeButton from '../likeButton';
import {
	FaPlay,
	FaStepForward,
	FaPause
} from 'react-icons/fa';

const Player = ({ songData, onPause, paused }) => {
	const { title, artists, image, id } = songData;

	return (
		<div className="player-container">
			<div className="player-left">
				<div className="player-song-image-container">
					<div style={{backgroundImage: `url(${image.url})`, backgroundPosition: 'center', backgroundSize: 'contain'}} className="player-song-image"></div>
				</div>
				<div className="player-song-info">
					<h2>{title}</h2>
					{artists.map((art) => <span>{art.name}</span>)}
				</div>
			</div>
			<div className="player-center">
				<button className="player-pause" onClick={ () => onPause(!paused)}>
					{paused ? <FaPlay /> : <FaPause />}
				</button>
				<button>
					<FaStepForward />
				</button>
			</div>
			<div className="player-right">
				{id && <LikeButton id={id} />}
			</div>
		</div>
	)
}

export default Player;