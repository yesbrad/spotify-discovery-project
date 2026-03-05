import { api } from '../constants';

/**
 * Start or resume playback on the user's active Spotify device.
 * @param {object} tokenData - { token } from getToken()
 * @param {object} options - { uris: string[], offset?: { position: number } | { uri: string }, position_ms?: number }
 * @returns {Promise<boolean>} - true if request succeeded (204), false otherwise
 */
export const startPlayback = async (tokenData, options = {}) => {
	try {
		const res = await fetch(`${api}/me/player/play`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${tokenData.token}`,
				'Content-Type': 'application/json',
			},
			body: Object.keys(options).length ? JSON.stringify(options) : undefined,
		});
		// 204 = success, 404 = no active device
		return res.status === 204;
	} catch (err) {
		console.error('startPlayback', err);
		return false;
	}
};

/**
 * Get the current playback state for the user.
 * Returns the raw Spotify Web API response for /me/player, or null on failure/204.
 */
export const getPlaybackState = async (tokenData) => {
	try {
		const res = await fetch(`${api}/me/player`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${tokenData.token}`,
			},
		});

		if (res.status === 204) {
			// No active device
			return null;
		}

		if (!res.ok) {
			return null;
		}

		return await res.json();
	} catch (err) {
		console.error('getPlaybackState', err);
		return null;
	}
};

/**
 * Pause playback on the user's active device.
 */
export const pausePlayback = async (tokenData) => {
	try {
		const res = await fetch(`${api}/me/player/pause`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${tokenData.token}` },
		});
		return res.status === 204;
	} catch (err) {
		console.error('pausePlayback', err);
		return false;
	}
};

/**
 * Seek to a position (in ms) in the current track.
 */
export const seekPlayback = async (tokenData, positionMs) => {
	try {
		const res = await fetch(
			`${api}/me/player/seek?position_ms=${encodeURIComponent(positionMs)}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${tokenData.token}`,
				},
			}
		);
		return res.status === 204;
	} catch (err) {
		console.error('seekPlayback', err);
		return false;
	}
};

/**
 * Skip to next track (requires an active device with a queue).
 */
export const skipToNext = async (tokenData) => {
	try {
		const res = await fetch(`${api}/me/player/next`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${tokenData.token}` },
		});
		return res.status === 204;
	} catch (err) {
		console.error('skipToNext', err);
		return false;
	}
};

/**
 * Set the volume on the active device.
 * @param {number} volumePercent - 0–100
 */
export const setVolume = async (tokenData, volumePercent) => {
	try {
		const res = await fetch(
			`${api}/me/player/volume?volume_percent=${encodeURIComponent(
				volumePercent
			)}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${tokenData.token}`,
				},
			}
		);
		return res.status === 204;
	} catch (err) {
		console.error('setVolume', err);
		return false;
	}
};

/** Get track URI for Web API: spotify:track:id */
export const getTrackUri = (track) =>
	track.uri || `spotify:track:${track.id}`;

export const likeSong = async (id) => {
	try {
		const tokenData = await getToken();
		await fetch(`${api}/me/tracks`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${tokenData.token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ids: [id] }),
		});
	} catch (err) {
		console.error('likeSong', err);
	}
};
