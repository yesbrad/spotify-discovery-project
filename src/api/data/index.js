import { api } from '../constants';
import { getToken } from '../auth';

export const getData = async (search, onLoadedArtist) => {
	let data = [];
	
	const tokenData = await getToken();
	console.log(tokenData);

	let newData = []
	let amount = 0;

	for (let i = 0; i < 1; i++){
		const response = await fetch(`${api}/search?q=genre:"${search}"&type=artist&offset=${amount}&limit=10`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const newDataSingle = await response.json();
		// console.log(newDataSingle);
		newData = [...newData, ...newDataSingle.artists.items]
		amount += 1;
	}
	
	for (let i = 0; i < newData.length; i++) {
		const topTracksResponse = await fetch(`${api}/artists/${newData[i].id}/top-tracks?country=AU`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`,
				'Content-Type': 'application/json'
			},
		})

		const topTrackData = await topTracksResponse.json();

		const topTrackFeatureResponse = await fetch(`${api}/audio-features/${topTrackData.tracks[0].id}`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`,
				'Content-Type': 'application/json'
			},
		})
		const topTrackFeatureData = await topTrackFeatureResponse.json();

		data = [...data, { ...newData[i], topTrackData, topTrackFeatureData }] 
		onLoadedArtist(data);
	}

	return 'Finished';
}