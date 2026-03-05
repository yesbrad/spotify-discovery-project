import moment from 'moment';
import { redirect_uri } from '../constants';

// Use the same Spotify client ID as the backend by default,
// but allow overriding via Vite env if provided.
const SPOTIFY_CLIENT_ID =
	import.meta.env.VITE_CLIENT_ID || 'e7e689f93e1d4e23b8476bfc0aaf5d61';

// Decide which Cloud Function endpoint to use for login.
// Prefer a manual override via env, otherwise:
// - use local emulator when running on localhost
// - use the live Cloud Function in production.
const getLoginApi = () => {
	const override = import.meta.env.VITE_FUNCTIONS_LOGIN_URL;
	if (override) return override;

	if (
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1'
	) {
		// Default Firebase Functions emulator URL for this project.
		return 'http://localhost:5001/spotify-discovery/us-central1/api/login';
	}

	// Deployed Cloud Function URL (production).
	return 'https://us-central1-spotify-discovery.cloudfunctions.net/api/login';
};

export const getToken = () =>
	new Promise(async (resolve, reject) => {
		try {
			const apiObjectSave = JSON.parse(localStorage.getItem('expireTime'));

			// Decide if we're using the refresh token
			const useRefresh =
				apiObjectSave && moment() > moment(apiObjectSave.expiry);

			// Get new code if we have never gotten one or the one we have has expired
			if (!apiObjectSave || useRefresh) {
				const authCode = await localStorage.getItem('authCode');

				if (authCode === '' || authCode == null) {
					console.log('Token request failed: Missing Auth Code');
					reject('Missing Auth Code');
					return;
				}

				const verifier = await localStorage.getItem('veri');

				if (authCode === verifier) {
					console.log('Token request failed: Same Codes');
					reject('Codes are the same');
					return;
				}

				if (verifier === '' || verifier == null) {
					console.log('Token request failed: Missing Verifier');
					alert('Failed Missing verifier');
					reject('Missing Verifier');
					return;
				}

				const tokenBody = `client_id=${encodeURIComponent(
					SPOTIFY_CLIENT_ID
				)}&grant_type=authorization_code&code=${encodeURIComponent(
					authCode
				)}&redirect_uri=${encodeURIComponent(
					redirect_uri
				)}&code_verifier=${encodeURIComponent(verifier)}`;

				const refreshBody = `client_id=${encodeURIComponent(
					SPOTIFY_CLIENT_ID
				)}&grant_type=refresh_token&refresh_token=${encodeURIComponent(
					apiObjectSave?.refresh
				)}`;

				const checkResponse = await fetch(
					`https://accounts.spotify.com/api/token`,
					{
						method: 'post',
						body: useRefresh ? refreshBody : tokenBody,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					}
				);

				const res = await checkResponse.json();

				// Spotify API sends errors back that are not caught. Catching them here
				if (res['error'] != undefined) {
					reject(`Token Error: ${res['error']}`);
					return;
				}

				// Save an object storing the necessary data
				const apiObject = {
					token: res.access_token,
					expiry: moment().add(res.expires_in, 'seconds'),
					refresh: res.refresh_token,
				};

				console.log('Using new token');

				localStorage.setItem('expireTime', JSON.stringify(apiObject));
				resolve(apiObject);
			} else {
				console.log('Using saved token');
				resolve(apiObjectSave);
			}
		} catch (err) {
			console.log('Token request failed', err?.message || err);
			reject(err);
		}
	});

export const onLogin = async () => {
	await localStorage.clear();

	try {
		const api = `${getLoginApi()}?redirect_uri=${encodeURIComponent(
			redirect_uri
		)}`;

		const res = await fetch(api, {
			method: 'get',
		});

		const data = await res.json();

		console.log(data);

		if (data.url) {
			await localStorage.setItem('veri', data.verifier);
			window.location.href = data.url;
		}
	} catch (err) {
		console.log(err?.message || err);
	}
};