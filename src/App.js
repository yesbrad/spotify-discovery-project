import React, { useEffect, useState } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import moment from 'moment';

const api = 'https://api.spotify.com/v1';

const App = () => {
	const [dataState, setDataState] = useState([])
	const [searchQuery, setSearchQuery] = useState('indie')
	const [d, setD] = useState(0)

	let data = []

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
			const response = await fetch(`${api}/search?q=genre:"${search}"&type=artist&limit=10`, {
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
				setDataState(data);
			}

			// console.log(data);
		} catch (err) {
			console.log(err.message);
		}
	}

	useEffect(() => {
		// localStorage.clear();
		if (dataState.length === 0) {
			getData('australian reggae fusion');
		}
	}, [])

  return (
	  <div className="App">
		  <form onSubmit={(e) => { e.preventDefault(); getData(searchQuery);}}>
			<input onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>
			<button >Search</button>
		  </form>
		<BubbleChart data={dataState} />
    </div>
  );
}

export default App;
