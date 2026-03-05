import { api } from '../constants';
import { getToken } from '../auth';

/** Fetches the user's top genres from their top artists (Spotify doesn't have a direct genres endpoint). */
export const getUserGenres = async () => {
	const tokenData = await getToken();
	const res = await fetch(`${api}/me/top/artists?limit=50&time_range=medium_term`, {
		method: 'get',
		headers: {
			'Authorization': `Bearer ${tokenData.token}`,
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err?.error?.message || `Failed to load genres (${res.status})`);
	}
	const data = await res.json();
	const count = {};
	for (const artist of data.items || []) {
		for (const g of artist.genres || []) {
			count[g] = (count[g] || 0) + 1;
		}
	}
	// Sort by frequency (most listened first), then alphabetically for ties
	return Object.entries(count)
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([name]) => name);
};

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
		if (loadedArtists.length === 0) {
			onLoadedArtist([], search);
		}
		for (let i = 0; i < loadedArtists.length; i++) {

			const topTracksResponse = await fetch(`${api}/artists/${loadedArtists[i].id}/top-tracks?country=AU`, {
				method: 'get',
				headers: {
					'Authorization': `Bearer ${tokenData.token}`,
					'Content-Type': 'application/json'
				},
			})

			const topTrackData = await topTracksResponse.json();

			const tracks = topTrackData.tracks;
			const firstTrackId = tracks?.[0]?.id;

			let topTrackFeatureData = null;

			if (firstTrackId) {
				try {
					const topTrackFeatureResponse = await fetch(`${api}/audio-features/${firstTrackId}`, {
						method: 'get',
						headers: {
							'Authorization': `Bearer ${tokenData.token}`,
							'Content-Type': 'application/json'
						},
					})

					const raw = await topTrackFeatureResponse.json();

					// Spotify returns { error: { status, message } } on failure; success has type "audio_features"
					if (topTrackFeatureResponse.ok && raw && !raw.error && (raw.energy != null || raw.valence != null)) {
						topTrackFeatureData = raw;
					}
				} catch (_) {
					// network or parse error: keep topTrackFeatureData null, use fallback below
				}
			}

			// Fallback when audio-features missing or failed: use spread values so bubbles still get different colors
			if (!topTrackFeatureData) {
				const t = i / Math.max(1, loadedArtists.length);
				topTrackFeatureData = {
					energy: 0.2 + 0.6 * t,
					acousticness: 0.5 - 0.4 * (i % 3) / 3,
					valence: 0.3 + 0.5 * (i % 5) / 5,
					danceability: 0.4 + 0.4 * (i % 7) / 7,
				};
				if (i === 0) console.warn('Spotify audio-features missing or failed; using fallback values. Check token scopes and that tracks have features.');
			}

			data = [...data, { ...loadedArtists[i], topTrackData, topTrackFeatureData }] 
			
			valid = onLoadedArtist(data, search);

		}
	}

	return 'Finished';
}

const LoadArtistsFromGenre = async (searchGenre, amount, tokenData) => {
	let loadedArtists = [];

	if (!searchGenre || String(searchGenre).trim() === '') {
		console.warn('LoadArtistsFromGenre: empty genre');
		return loadedArtists;
	}

	const trySearch = async (query) => {
		const q = encodeURIComponent(query);
		const response = await fetch(`${api}/search?q=${q}&type=artist&limit=50`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`,
			},
		});
		const json = await response.json();
		const items = json?.artists?.items ?? [];
		return Array.isArray(items) ? items : [];
	};

	// 1) Exact genre search: genre:"..."
	const exactQuery = `genre:"${searchGenre.trim()}"`;
	let batch = await trySearch(exactQuery);

	// 2) If no results, try Spotify seed-style (hyphenated, no quotes)
	if (batch.length === 0) {
		const hyphenated = searchGenre.trim().toLowerCase().replace(/\s+/g, '-');
		if (hyphenated !== searchGenre.trim()) {
			batch = await trySearch(`genre:${hyphenated}`);
		}
	}

	// 3) If still empty, keyword search so we still get some artists
	if (batch.length === 0) {
		batch = await trySearch(searchGenre.trim());
	}

	loadedArtists = batch;

	// Paginate for more only if we got a full page
	let offset = 50;
	for (let i = 0; i < 9 && batch.length === 50; i++) {
		const nextQuery = encodeURIComponent(exactQuery);
		const response = await fetch(`${api}/search?q=${nextQuery}&type=artist&offset=${offset}&limit=50`, {
			method: 'get',
			headers: {
				'Authorization': `Bearer ${tokenData.token}`,
			},
		});
		const json = await response.json();
		batch = json?.artists?.items ?? [];
		if (!Array.isArray(batch) || batch.length === 0) break;
		loadedArtists = [...loadedArtists, ...batch];
		offset += 50;
		if (batch.length < 50) break;
	}

	return loadedArtists;
};