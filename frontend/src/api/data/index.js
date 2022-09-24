import { api } from '../constants';
import { getToken } from '../auth';

export const getData = async (search, onLoadedArtist, searchType) => {
	let data = [];
	
	const tokenData = await getToken();
	//console.log(tokenData);

	let loadedArtists = []
	let amount = 0;
	let valid = true;

	if(searchType === "genre"){
		loadedArtists = await LoadArtistsFromGenre(search, 10, tokenData)
	}

	if (searchType === "artist") {
		const artistRes = await fetch(`${api}/search?q=artist:"${search}"&type=artist&offset=${amount}&limit=1`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const newDataArtistRes = await artistRes.json();
		const artistGenre = newDataArtistRes.artists.items[0].genres[0];
		loadedArtists = await LoadArtistsFromGenre(artistGenre, 10, tokenData);
		console.log(artistGenre);
	}

	if(searchType === "recommend"){
		const topGenreRes = await fetch(`${api}/me/top/tracks`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const topGenre = await topGenreRes.json();

		console.log(topGenre);


		const seed_genres = "";
		const seed_artists = "";
		const seed_tracks = "2Q21xcp6m1Y2MpDkt6MU61";

		const artistRes = await fetch(`${api}/recommendations?q=seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&limit=100`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const resso = await artistRes.json();

		console.log(resso);

		
		for(let i = 0; i < resso.tracks.length; i++)
		{
			//loadedArtists.push({id: val.artists[0].id});

			const arRes = await fetch(`${api}/artists/${resso.tracks[i].artists[0].id}`, {
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${tokenData.token}`
				},
			})

			const fullData = await arRes.json();

			loadedArtists = [...loadedArtists, fullData]
		}

		console.log(loadedArtists);

	}

	if(loadedArtists != null && loadedArtists.length >= 0)
	{
		for (let i = 0; i < loadedArtists.length; i++) {
			//if (!valid) return;

			const topTracksResponse = await fetch(`${api}/artists/${loadedArtists[i].id}/top-tracks?country=AU`, {
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

			data = [...data, { ...loadedArtists[i], topTrackData, topTrackFeatureData }] 
			
			valid = onLoadedArtist(data, search);

		}
	}

	return 'Finished';
}

const LoadArtistsFromGenre = async (searchGenre, amount, tokenData) => {
	let loadedArtists = []

	if(searchGenre === ""){
		console.log("No Search Genre!")
		return;
	}

	for (let i = 0; i < 10; i++){
		const response = await fetch(`${api}/search?q=genre:"${searchGenre}"&type=artist&offset=${amount}&limit=50`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`
			},
		})

		const newDataSingle = await response.json();
		// console.log(newDataSingle);
		loadedArtists = [...loadedArtists, ...newDataSingle.artists.items]
		amount += 50;
	}

	return loadedArtists;
}