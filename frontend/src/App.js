import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';
import SearchBar from './components/searchBar';
import Login from './components/login';
import { getToken, onLogin } from './api/auth';
import { getData } from './api/data';
import { play } from './api/player';
import Player from './components/player';
import ViewCategorys from './data/viewCategorys';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [hasLoaded, SetHasLoaded] = useState(false); 
	const [isLoading, SetIsLoading] = useState(false);

	const audRef = useRef();

	const [currentSongData, setCurrentSongData] = useState({
		title: '',
		artists: [],
		image: '',
		id: ''
	})

	const saveQueryCode = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		if (urlParams.has('code')) {
			console.log(urlParams.get('code'));
			localStorage.setItem('authCode', urlParams.get('code'))
		}
	}

	const checkAuthState = async () => {
		console.log('checking auth state');
		
		try {	
			await getToken();
			SetAuthError(false);
		} catch {
			SetAuthError(true);
		}
	}

	const startUp = async () => {
		SetHasLoaded(false);
		saveQueryCode();
		await checkAuthState();
		//getMusicData('australian reggae fusion');
		SetHasLoaded(true);
	}

	useEffect(() => {
		startUp();
	}, [])

	const getMusicData = async (search) => {
		
		if (isLoading) return;
		
		console.log('CLICKED', search);
		SetIsLoading(true);

		setDataState([]);

		try {
			await getData(search, (data) => {
				setDataState(data);
			});
		} catch (err) {
			console.log(err);
		}

		SetIsLoading(false)
	};

	const playSong = (input) => {
		audRef.current.src = input.preview_url;
		audRef.current.play();
		
console.log(input);

		setCurrentSongData({
			title: input.name,
			artists: input.artists,
			image: input.album.images[0],
			id: input.id,
		})
	}
	
	if(!hasLoaded) return <span>LOADING</span>

	if(authError) return <Login onLogin={() => onLogin()} />

	return (
		<div className="App">
			{/* {authError && <button onClick={() => onLogin()}>LOGIN</button>} */}
			{/* <button onClick={() => localStorage.clear()}>CLEAR STORAGE</button> */}
			{/* <span>{`Error: ${authError}`}</span> */}
			<SearchBar onSearch={input => getMusicData(input)} isLoading={isLoading}/>
			<Player songData={currentSongData}/>
			<BubbleChart data={dataState} onPlayTrack={(uri) => playSong(uri)} viewCategory={ViewCategorys[1]}/>
			<audio ref={audRef} />
		</div>
	);
}

export default App;
