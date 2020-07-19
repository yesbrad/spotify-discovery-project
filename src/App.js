import React, { useEffect, useState } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import moment from 'moment';
import SearchBar from './components/searchBar';
import crypto from 'crypto';
import { json } from 'd3';

const api = 'https://api.spotify.com/v1';
const redirect_uri = 'http://localhost:3000/';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [hasLoaded, SetHasLoaded] = useState(false);

	let data = [];

	const getToken = () => new Promise(async (resolve, reject) => {
		try {
			const apiObjectSave = JSON.parse(localStorage.getItem('expireTime'));

			// Decide If where using the refresh token
			const useRefresh = apiObjectSave && moment() > moment(apiObjectSave.expireTime)

			// Get new code if we have never gotten one or the one we have has expired
			if (!apiObjectSave || useRefresh)
			{
				const authCode = await localStorage.getItem('authCode');

				if (!authCode) {
					reject('Missing Auth Code');
					return;
				}
				
				const verifier = await localStorage.getItem('veri');
				
				if (verifier === null) {
					reject('Missing Verifier');
					return;
				}
				
				const tokenBody = `client_id=${process.env.REACT_APP_CLIENT_ID}&grant_type=authorization_code&code=${authCode}&redirect_uri=${redirect_uri}&code_verifier=${verifier}`;
				const refreshBody = `client_id=${process.env.REACT_APP_CLIENT_ID}&grant_type=refresh_token&refresh_token=${apiObjectSave?.refresh}`;

				const checkResponse = await fetch(`https://accounts.spotify.com/api/token`, {
					method: 'post',
					body: useRefresh ? refreshBody : tokenBody,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				});
				
				const res = await checkResponse.json();
				
				// Spotify API sends errors back that are not caught. Catching them here
				if (res['error'] != undefined) {
					reject(`Token Error: ${res['error']}`)
					return;
				}
				
				// Save a object storing the nessasy data
				const apiObject = {
					token: res.access_token,
					expiry: moment().add(res.expires_in, 'seconds'),
					refresh: res.refresh_token,
				}

				// console.log('Using new token', apiObject);

				localStorage.setItem('expireTime', JSON.stringify(apiObject))
				resolve(apiObject);
			} else {
				// console.log('Using saved token');
				resolve(apiObjectSave);
			}
		} catch (err) {
			console.log('Token request failed', err);
			reject(err);
		}
	})

	const base64URLEncode = (str) => {
		return str.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=/g, '');
	}

	const sha256 = (buffer) => {
		return crypto.createHash('sha256').update(buffer).digest();
	}

	const getAccessCode = async () => {
		try {
			const verifier = base64URLEncode(crypto.randomBytes(32));
			const hash = base64URLEncode(sha256(verifier));
			
			const authResponse = await fetch(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${redirect_uri}&code_challenge_method=S256&code_challenge=${hash}&scope=user-modify-playback-state`, {
				method: 'get',
			});

			if (authResponse.redirected) {
				await localStorage.setItem('veri', verifier);
				window.location.href = authResponse.url;
			}
		} catch (err){
			console.log(err.message);
		}
	}

	const getData = async (search) => {
		try {
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
			
			console.log(newData);

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
				// console.log(data);
				setDataState(data);
			}
		} catch (err) {
			SetAuthError(true);
			console.log(err);
		}
	}

	const saveQueryCode = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		if (urlParams.has('code')) {
			localStorage.setItem('authCode', urlParams.get('code'))
		}
	}

	const checkAuthState = async () => {
		const hasCode = localStorage.getItem('authCode');
		console.log('checking auth state');
		
		if (hasCode) {
			try {	
				await getToken();
				SetAuthError(false);
			} catch {
				SetAuthError(true);
			}
		}
	}

	const startUp = async () => {
		SetHasLoaded(false);
		saveQueryCode();
		await checkAuthState();
		getData('australian reggae fusion');
		SetHasLoaded(true);
	}

	useEffect(() => {
		startUp();
	}, [])

	const onConnectSpotifyPlayer = async (uri, code) => {
		try {
			const tokenData = await getToken(code);
			console.log('PLAY TOKEN DATA', tokenData);
			const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play`, {
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
			SetAuthError(true);
		}
	}
	
	if(!hasLoaded) return <span>LOADING</span>

	return (
		<div className="App">
			{authError && <button onClick={() => getAccessCode()}>LOGIN</button>}
			<button onClick={() => localStorage.clear()}>CLEAR STORAGE</button>
			<span>{`Error: ${authError}`}</span>
			<SearchBar onSearch={input => getData(input)} />
			<BubbleChart data={dataState} onPlayTrack={(uri) => onConnectSpotifyPlayer(uri)}/>
		</div>
	);
}

export default App;
