import React, { useEffect, useState } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import SearchBar from './components/searchBar';
import Login from './components/login';
import { getToken, onLogin } from './api/auth';
import { getData } from './api/data';
import { play } from './api/player';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [hasLoaded, SetHasLoaded] = useState(false);

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
		getMusicData('australian reggae fusion');
		SetHasLoaded(true);
	}

	useEffect(() => {
		startUp();
	}, [])

	const getMusicData = async (search) => {
		try {
			getData(search, (data) => {
				setDataState(data);
			})
		} catch (err) {
			console.log(err);
		}
	};
	
	if(!hasLoaded) return <span>LOADING</span>

	if(authError) return <Login onLogin={() => onLogin()} />

	return (
		<div className="App">
			{/* {authError && <button onClick={() => onLogin()}>LOGIN</button>} */}
			<button onClick={() => localStorage.clear()}>CLEAR STORAGE</button>
			{/* <span>{`Error: ${authError}`}</span> */}
			<SearchBar onSearch={input => getMusicData(input)} />
			<BubbleChart data={dataState} onPlayTrack={(uri) => play(uri)}/>
		</div>
	);
}

export default App;
