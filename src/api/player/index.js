import { getToken } from '../auth';
import { api } from '../constants';

export const play = async (uri) => {
	try {
		const tokenData = await getToken();

		const track = await fetch(`${api}/tracks/${uri}`, {
			headers: {
				Authorization: `Bearer ${tokenData.token}`,
			}
		})

		const trackData = await track.json();

		console.log(trackData);

		// const playResponse = await fetch(`${api}/me/player/play`, {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Authorization': `Bearer ${tokenData.token}`,
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		uris: [uri],
		// 		offset: {
		// 			"position": 0,
		// 		},
		// 		position_ms: 0
		// 	})
		// })

		// const playData = await playResponse.text();
		// console.log(playData);

		// const currentlyPlayingResponse = await fetch(`${api}/me/player/currently-playing`, {
		// 	headers: {
		// 		Authorization: `Bearer ${tokenData.token}`
		// 	}
		// })

		// const currentlyPlayingData = await currentlyPlayingResponse.json();

		// console.log('Currenly Playing', currentlyPlayingData.item);

		// return currentlyPlayingData.item;

	} catch (err) {
		console.log(err);
	}
}

export const likeSong = async (id) => {
	try {
		const tokenData = await getToken();
		const track = await fetch(`https://api.spotify.com/v1/me/tracks`, {
			method: 'put',
			headers: {
				"Authorization": `Bearer ${tokenData.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ids: [id]
			}),
		});
		console.log("finsihed the like");
		const trackData = await track.text();
		console.log(trackData);
	} catch (err) {
		console.log(err);
	}
}