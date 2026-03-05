import React from 'react';
import './index.scss';
import Button from '../button';
import LikeButton from '../likeButton';
import {
	FaPlay,
	FaStepForward,
	FaPause,
	FaStepBackward,
} from 'react-icons/fa';

const formatTime = (ms) => {
	if (!ms || Number.isNaN(ms)) return '0:00';
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Player = ({
	songData,
	onPause,
	paused,
	onNextSong,
	onPrevSong,
	onLogOut,
	positionMs = 0,
	durationMs = 0,
	onSeek,
	volume = 100,
	onChangeVolume,
}) => {
	const { title, artists, image, id } = songData;

	const safeDuration = durationMs > 0 ? durationMs : 0;
	const progressPercent =
		safeDuration > 0 ? Math.min(100, Math.max(0, (positionMs / safeDuration) * 100)) : 0;

	const handleSeekChange = (e) => {
		if (!onSeek || !safeDuration) return;
		const percent = Number(e.target.value);
		if (Number.isNaN(percent)) return;
		const nextPosition = (percent / 100) * safeDuration;
		onSeek(nextPosition);
	};

	const handleVolumeChange = (e) => {
		if (!onChangeVolume) return;
		const next = Number(e.target.value);
		if (Number.isNaN(next)) return;
		onChangeVolume(next);
	};

	return (
		<div className="player-container">
			<div className="player-left">
				<div className="player-song-image-container">
					<div style={{backgroundImage: image?.url ? `url(${image.url})` : 'none', backgroundPosition: 'center', backgroundSize: 'contain'}} className="player-song-image"></div>
				</div>
				<div className="player-song-info">
					<h2>{title}</h2>
					{artists.map((art) => <span key={art.id || art.name}>{art.name}</span>)}
				</div>
			</div>	
			<div className="player-center">
				<div className="player-controls">
					<button
						className="player-skip"
						onClick={onPrevSong}
						disabled={!id}
						aria-label="Previous track"
					>
						<FaStepBackward />
					</button>
					<button
						className="player-pause"
						onClick={() => onPause(!paused)}
						disabled={!id}
						aria-label={paused ? 'Play' : 'Pause'}
					>
						{paused ? <FaPlay /> : <FaPause />}
					</button>
					<button
						className="player-skip"
						onClick={onNextSong}
						disabled={!id}
						aria-label="Next track"
					>
						<FaStepForward />
					</button>
					<div className="player-mobile-like">
						{id && <LikeButton id={id} />}
					</div>
				</div>
				<div className="player-progress">
					<span className="player-time">
						{formatTime(positionMs)}
					</span>
					<input
						type="range"
						min="0"
						max="100"
						value={progressPercent}
						onChange={handleSeekChange}
						disabled={!id || !safeDuration}
					/>
					<span className="player-time">
						{formatTime(safeDuration)}
					</span>
				</div>
			</div>
			<div className="player-right">
				{id && <LikeButton id={id} />}
				<div className="player-volume">
					<input
						type="range"
						min="0"
						max="100"
						value={volume}
						onChange={handleVolumeChange}
						aria-label="Volume"
					/>
				</div>
				<Button title="LOGOUT" onClick={() => onLogOut()} red />
			</div>
			<div className="logo">

			</div>
		</div>
	)
}

export default Player;
