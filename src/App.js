import React, { useEffect, useState } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import moment from 'moment';
import SearchBar from './components/searchBar';
import SpotifyWebApi from 'spotify-web-api-js';
const spotify = new SpotifyWebApi();

const api = 'https://api.spotify.com/v1';

const App = () => {
	const [dataState, setDataState] = useState([]);

let data = [];

	const CheckToken = () => new Promise(async (resolve, reject) => {

		try {
			const apiObjectSave = JSON.parse(localStorage.getItem('expireTime'));

			if (!apiObjectSave || moment() > moment(apiObjectSave.expireTime))
			{
				const checkResponse = await fetch(`https://accounts.spotify.com/api/token`, {
					method: 'post',
					body: 'grant_type=client_credentials',
					headers: {
						'Authorization': `Basic ${process.env.REACT_APP_REFRESH_TOKEN}`,
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				});
				
				const res = await checkResponse.json();
				
				const apiObject = {
					token: res.access_token,
					expiry: res.expires_in
				}
				
				localStorage.setItem('expireTime', JSON.stringify({token: apiObject.token, expireTime: moment().add(res.expires_in, 'seconds')}))
				// console.log('Using saved new token', process.env.REACT_APP_REFRESH_TOKEN);
				resolve(apiObject);
			} else {
				// console.log('Using saved token');
				resolve(apiObjectSave);
			}
		} catch (err) {
			console.log('Token request failed');
			reject(err);
		}
	})

	const getData = async (search) => {
		try {
			const tokenData = await CheckToken();
			console.log(search);
			const response = await fetch(`${api}/search?q=genre:"${search}"&type=artist&limit=50`, {
				method: 'get',
				headers: {
					'Authorization': `Bearer ${tokenData.token}`
				},
			})
			
			const newData = await response.json();
			// console.log(newData);

			for (let i = 0; i < newData.artists.items.length; i++) {
				const topTracksResponse = await fetch(`${api}/artists/${newData.artists.items[i].id}/top-tracks?country=AU`, {
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

				data = [...data, { ...newData.artists.items[i], topTrackData, topTrackFeatureData }] 
				console.log(data);
				setDataState(data);
			}

			// console.log(data);
		} catch (err) {
			console.log(err.message);
		}
	}

	useEffect(() => {
		// localStorage.clear();
		// spotify.setAccessToken('BQDIaN96QMN6wbFNrFXfysexx-3sm19-8lO8pWoi8_B65ji7gULrLVENd0aSw6oSO54djXAHmCA92hrdsrFx05TkKS6BNbD8fkqzvhsOlWS0gXgkmvnqi_WBhNS7DqPmX6la4Clfh1HLRDdKe0-BFItGHWniD_ijTg');

		if (dataState.length === 0) {
			// onConnectSpotifyPlayer("spotify:artist:3ZGr7nQBXDU2WhyXgRVbt0");
			getData('australian reggae fusion');
		}
	}, [])

	const onConnectSpotifyPlayer = async (uri) => {
		// spotify.onConnectSpotifyPlayer
		// spotify.play({uris: ["spotify:track:3VxKtnYHUwrX65SO69QEYA"]}, function ( err, data ) {
		// 	if (err) {
		// 		console.error(err)
		// 	} else {
		// 		console.log("spotify:track:3VxKtnYHUwrX65SO69QEYA")
		// 	}
		// })

		const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer BQDIaN96QMN6wbFNrFXfysexx-3sm19-8lO8pWoi8_B65ji7gULrLVENd0aSw6oSO54djXAHmCA92hrdsrFx05TkKS6BNbD8fkqzvhsOlWS0gXgkmvnqi_WBhNS7DqPmX6la4Clfh1HLRDdKe0-BFItGHWniD_ijTg`,
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
	}
	

  return (
	  <div className="App">
		<SearchBar onSearch={input => getData(input)} />
		  <BubbleChart data={dataState} onPlayTrack={(uri) => onConnectSpotifyPlayer(uri)}/>
    </div>
  );
}

export default App;
