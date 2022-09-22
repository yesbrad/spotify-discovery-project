import { api } from '../constants';
import { getToken } from '../auth';

export const getData = async (search, onLoadedArtist, isGenre) => {
	let data = [];
	
	const tokenData = await getToken();
	//console.log(tokenData);

	let newData = []
	let amount = 0;
	let valid = true;

	let artistGenre = "";

	if (isGenre) {
		console.log("CURTIS")
		const artistRes = await fetch(`${api}/search?q=artist:"${search}"&type=artist&offset=${amount}&limit=1`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const newDataArtistRes = await artistRes.json();
		//newData = [...newData, ...newDataSingle.artists.items]
		artistGenre = newDataArtistRes.artists.items[0].genres[0];
		console.log(artistGenre);
	}

	for (let i = 0; i < 10; i++){
		const response = await fetch(`${api}/search?q=genre:"${isGenre ? artistGenre : search}"&type=artist&offset=${amount}&limit=50`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const newDataSingle = await response.json();
		// console.log(newDataSingle);
		newData = [...newData, ...newDataSingle.artists.items]
		amount += 50;
	}
	
	for (let i = 0; i < newData.length; i++) {
		if (!valid) return;

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

		
		valid = onLoadedArtist(data, search);

	}

	return 'Finished';
}