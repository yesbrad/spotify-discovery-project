import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import BubbleChart from './components/bubbleChart';
import SearchBar from './components/searchBar';
import Login from './components/login';
import { getToken, onLogin } from './api/auth';
import { getData } from './api/data';
import { play } from './api/player';
import Player from './components/player';
import ViewCategorys from './data/viewCategorys';
import ViewCategoryBar from './components/viewCategoryBar';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [hasLoaded, SetHasLoaded] = useState(false); 
	const [isLoading, SetIsLoading] = useState(false);
	const [currentCategory, setCurrentCategory] = useState(0)
	const [isPaused, SetIsPaused] = useState(true);

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

	const onPause = (pause) => {
		if(isPaused)
			audRef.current.play();
		else
			audRef.current.pause();
		
		SetIsPaused(pause);
	}

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
		
		onPause(false);
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
			<div className="nav-top">
				<SearchBar onSearch={input => getMusicData(input)} isLoading={isLoading} />
				<ViewCategoryBar categorys={ViewCategorys} onSelectViewCategory={(cat) => setCurrentCategory(cat)} />
			</div>
			<Player songData={currentSongData} onPause={pause => onPause(pause)} paused={isPaused}/>
			<BubbleChart data={dataState} onPlayTrack={(uri) => playSong(uri)} viewCategory={ViewCategorys[currentCategory]}/>
			<audio ref={audRef} />
		</div>
	);
}

export default App;
