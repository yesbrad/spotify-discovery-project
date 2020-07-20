import React, { useState } from 'react';
import './index.css';
import Button from '../button';

const Player = ({ songData, onPlay }) => {
	console.log(songData.image);
	return (
		<div className="player-container">
			<div className="player-song-image-container">
				<div style={{backgroundImage: `url(${songData.image.url})`, backgroundPosition: 'center', backgroundSize: 'contain'}} className="player-song-image"></div>
			</div>
			<div className="player-song-info">
				<h2>{songData.title}</h2>
				{songData.artists.map((art) => <span>{art.name}</span>)}
			</div>
		</div>
	)
}

export default Player;