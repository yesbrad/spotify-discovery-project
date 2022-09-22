import React, { useEffect, useState, useRef } from 'react';
//import './App.scss';
import BubbleChart from './components/bubbleChart';
import SearchBar from './components/searchBar';
import Login from './components/login';
import { getToken, onLogin } from './api/auth';
import { getData } from './api/data';
import Player from './components/player';
import ViewCategorys from './data/viewCategorys';
import ViewCategoryBar from './components/viewCategoryBar';
import Tutorial from './components/tutorial';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [hasLoaded, SetHasLoaded] = useState(false); 
	const [isLoading, SetIsLoading] = useState(false);
	const [currentCategory, setCurrentCategory] = useState(0)
	const [isPaused, SetIsPaused] = useState(true);
	const [currentTracks, setCurrentTracks] = useState(null)
	const [currentTrack, setCurrentTrack] = useState(0)
	const [currentSearch, setCurrentSearch] = useState('')
	const [isTutorial, SetIsTutorial] = useState(true);
	const [isCategoryOpen, SetIsCategoryOpen] = useState(true);

	const audRef = useRef();

	const [currentSongData, setCurrentSongData] = useState({
		title: '',
		artists: [],
		image: '',
		id: ''
	})

	const saveQueryCode = async () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		if (urlParams.has('code')) {
			//console.log(urlParams.get('code'));
			await localStorage.setItem('authCode', urlParams.get('code'))
			urlParams.delete('code');
			window.location.search = urlParams;
		}

		if (urlParams.has('search')) {
			console.log(urlParams.get("search"))
			setCurrentSearch(urlParams.get("search"));
		}
		else{
			setCurrentSearch("Indie Pop");
		}
	}

	const checkAuthState = async () => {
		//console.log('checking auth state');
		
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

	const getMusicData = async (search, isGenre) => {
		
		if (isLoading) {
			setDataState([]);
			SetIsTutorial(true);
			SetIsLoading(false);


			const urlParams = new URLSearchParams(window.location.search);

			if(urlParams.has("search"))
				urlParams.delete("search")

			urlParams.append("search", search)
			window.location.search = urlParams;

			//window.location.reload();
			return;
		};



		SetIsTutorial(false);
		SetIsLoading(true);

		setCurrentSearch(search);
		setDataState([]);

		const urlParams = new URLSearchParams(window.location.search);
		const nextState = { additionalInformation: 'Updated the URL with JS' };

		if(urlParams.has("search"))
			urlParams.delete("search")

		urlParams.append("search", search)

		window.history.replaceState(nextState, "thing", "?" + urlParams);

		try {
			await getData(search, (data, originalSearch) => {
				setDataState(data);
				return true;
			}, isGenre);
		} catch (err) {
			console.log(err);
		}

		SetIsLoading(false)
	};

	const onNextSong = () => {
		if (currentTracks === null) {
			return;
		}

		//console.log(currentTracks);

		audRef.current.src = currentTracks[currentTrack + 1].preview_url;
		
		onPause(false);
		audRef.current.play();

		if(currentTrack > currentTracks.length - 3)
			setCurrentTrack(0);
		else
			setCurrentTrack(currentTrack + 1);

		setCurrentSongData({
			title: currentTracks[currentTrack + 1].name,
			artists: currentTracks[currentTrack + 1].artists,
			image: currentTracks[currentTrack + 1].album.images[0],
			id: currentTracks[currentTrack + 1].id,
		})
	}

	const playSong = (tracks, track) => {
		audRef.current.src = tracks[track].preview_url;
		onPause(false);
		audRef.current.play();

		//console.log(tracks[track]);
		setCurrentTracks(tracks);
		setCurrentTrack(0);

		setCurrentSongData({
			title: tracks[track].name,
			artists: tracks[track].artists,
			image: tracks[track].album.images[0],
			id: tracks[track].id,
		})
	}
	
	if(!hasLoaded) return <span>LOADING</span>

	if(authError) return <Login onLogin={() => onLogin()} />

	return (
		<div className="App" style={{height: 0}}>
			{/* {authError && <button onClick={() => onLogin()}>LOGIN</button>} */}
			{/* <button onClick={() => localStorage.clear()}>CLEAR STORAGE</button> */}
			{/* <span>{`Error: ${authError}`}</span> */}
			<Tutorial isTutorial={isTutorial}/>
			<SearchBar onSearch={(input, isGenre) => getMusicData(input, isGenre)} isLoading={isLoading} initial={currentSearch}/>
			{isCategoryOpen && <ViewCategoryBar categorys={ViewCategorys} onSelectViewCategory={(cat) => setCurrentCategory(cat)} onHide={() => SetIsCategoryOpen(!isCategoryOpen) }/>}
			<Player onNextSong={onNextSong} songData={currentSongData} onPause={pause => onPause(pause)} paused={isPaused}/>
			<BubbleChart data={dataState} onPlayTrack={(uri, track) => playSong(uri, track)} viewCategory={ViewCategorys[currentCategory]}/>
			<audio ref={audRef} />
		</div>
	);
}

export default App;
