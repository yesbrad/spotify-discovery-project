import { getToken } from '../auth';
import { api } from '../constants';

export const play = async (uri) => {
	try {
		const tokenData = await getToken();
		const playResponse = await fetch(`${api}/me/player/play`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				uris: [uri],
				offset: {
					"position": 0,
				},
				position_ms: 0
			})
		})

		const playData = await playResponse.text();
		console.log(playData);
	} catch (err) {
		console.log(err);
	}
}