import React, { useEffect, useState } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import moment from 'moment';

const api = 'https://api.spotify.com/v1';

const App = () => {
	const [data, setData] = useState([])
	const [searchQuery, setSearchQuery] = useState('indie')

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
				console.log('Using saved new token', process.env.REACT_APP_REFRESH_TOKEN);
				resolve(apiObject);
			} else {
				console.log('Using saved token');
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
			setData(newData.artists.items);
		} catch (err) {
			console.log(err.message);
		}
	}

	useEffect(() => {
		// localStorage.clear();
		getData('australian reggae fusion');
	}, [])

  return (
	  <div className="App">
		  <form onSubmit={(e) => { e.preventDefault(); getData(searchQuery);}}>
			<input onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>
			<button >Search</button>
		  </form>
		<BubbleChart data={data} />
    </div>
  );
}

export default App;
