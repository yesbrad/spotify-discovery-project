import moment from 'moment';
import crypto from 'crypto';
import { redirect_uri } from '../constants';

export const getToken = () => new Promise(async (resolve, reject) => {
	try {
		const apiObjectSave = JSON.parse(localStorage.getItem('expireTime'));

		// Decide If where using the refresh token
		const useRefresh = apiObjectSave && moment() > moment(apiObjectSave.expiry)

		// Get new code if we have never gotten one or the one we have has expired
		if (!apiObjectSave || useRefresh) {
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
});

export const onLogin = async () => {
	try {
		//console.log('object');
		
		const api = 'https://us-central1-spotify-disovery.cloudfunctions.net/api/login';
	//const api = 'http://localhost:5000/spotify-disovery/us-central1/api/login';
		//console.log("Usinbg Local host");
		const res = await fetch(api, {
			method: 'get',
		});

		const data = await res.json();

		//console.log(data);

		if (data.url) {
			await localStorage.setItem('veri', data.verifier);
			window.location.href = data.url;
		}
	} catch (err){
		console.log(err.message);
	}
}