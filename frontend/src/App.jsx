import React, { useEffect, useState, useRef } from 'react';
//import './App.scss';
import BubbleChart from './components/bubbleChart';
import SearchBar from './components/searchBar';
import Login from './components/login';
import { getToken, onLogin } from './api/auth';
import { getData } from './api/data';
import {
	startPlayback,
	pausePlayback,
	skipToNext,
	getTrackUri,
} from './api/player';
import Player from './components/player';
import ViewCategorys from './data/viewCategorys';
import ViewCategoryBar from './components/viewCategoryBar';
import Tutorial from './components/tutorial';
import GenreDropdown from './components/genreDropdown';

const App = () => {
	const [dataState, setDataState] = useState([]);
	const [authError, SetAuthError] = useState(false);
	const [authErrorMessage, setAuthErrorMessage] = useState('');
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
	const useSpotifyPlaybackRef = useRef(false);

	const [currentSongData, setCurrentSongData] = useState({
		title: '',
		artists: [],
		image: '',
		id: ''
	})

	const saveQueryCode = async () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		if (urlParams.has('search')) {
			console.log(urlParams.get("search"))
			setCurrentSearch(urlParams.get("search"));
		}
		else{
			setCurrentSearch("Indie Pop");
			urlParams.append("search", "indie pop");
		}

		if (urlParams.has('code')) {
			await localStorage.setItem('authCode', urlParams.get('code'))
			urlParams.delete('code');
		}
		
		window.history.replaceState({}, "thing", "?" + urlParams);
	}

	const checkAuthState = async () => {
		setAuthErrorMessage('');
		try {
			await getToken();
			SetAuthError(false);
		} catch (err) {
			SetAuthError(true);
			setAuthErrorMessage(err?.message || String(err));
		}
	}

	const startUp = async () => {
		SetHasLoaded(false);
		await saveQueryCode();
		await checkAuthState();
		SetHasLoaded(true);
	}

	useEffect(() => {
		startUp();
	}, [])

	const onPause = async (pause) => {
		if (useSpotifyPlaybackRef.current) {
			try {
				const tokenData = await getToken();
				if (pause) {
					await pausePlayback(tokenData);
				} else {
					await startPlayback(tokenData, {});
				}
			} catch (_) {
				useSpotifyPlaybackRef.current = false;
			}
		} else {
			if (audRef.current) {
				if (pause) audRef.current.pause();
				else audRef.current.play();
			}
		}
		SetIsPaused(pause);
	};

	const getMusicData = async (search, searchType) => {
		
		if (isLoading) {
			setDataState([]);
			SetIsTutorial(true);
			SetIsLoading(false);

			const urlParams = new URLSearchParams(window.location.search);

			if(urlParams.has("search"))
				urlParams.delete("search")

			urlParams.append("search", search)
			window.location.search = urlParams;
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
				console.log(data);
				return true;
			}, searchType);
		} catch (err) {
			console.log(err);
		}

		SetIsLoading(false)
	};

	const onNextSong = async () => {
		if (currentTracks === null) return;

		const nextIndex =
			currentTrack >= currentTracks.length - 1 ? 0 : currentTrack + 1;
		const nextTrack = currentTracks[nextIndex];

		if (useSpotifyPlaybackRef.current) {
			try {
				const tokenData = await getToken();
				const uris = currentTracks.map(getTrackUri);
				const ok = await startPlayback(tokenData, {
					uris,
					offset: { position: nextIndex },
				});
				if (ok) {
					setCurrentTrack(nextIndex);
					setCurrentSongData({
						title: nextTrack.name,
						artists: nextTrack.artists,
						image: nextTrack.album?.images?.[0] ?? { url: '' },
						id: nextTrack.id,
					});
					SetIsPaused(false);
					return;
				}
			} catch (_) {}
			useSpotifyPlaybackRef.current = false;
		}

		// Preview fallback or primary when not using Spotify
		if (nextTrack.preview_url && audRef.current) {
			audRef.current.src = nextTrack.preview_url;
			setCurrentTrack(nextIndex);
			setCurrentSongData({
				title: nextTrack.name,
				artists: nextTrack.artists,
				image: nextTrack.album?.images?.[0] ?? { url: '' },
				id: nextTrack.id,
			});
			SetIsPaused(false);
			audRef.current.play();
		} else {
			setCurrentTrack(nextIndex);
			setCurrentSongData({
				title: nextTrack.name,
				artists: nextTrack.artists,
				image: nextTrack.album?.images?.[0] ?? { url: '' },
				id: nextTrack.id,
			});
		}
	};

	const playSong = async (tracks, track) => {
		const trackIndex = typeof track === 'number' ? track : 0;
		const uris = tracks.map(getTrackUri);
		const selected = tracks[trackIndex];

		setCurrentTracks(tracks);
		setCurrentTrack(trackIndex);
		setCurrentSongData({
			title: selected.name,
			artists: selected.artists,
			image: selected.album?.images?.[0] ?? { url: '' },
			id: selected.id,
		});

		try {
			const tokenData = await getToken();
			const ok = await startPlayback(tokenData, {
				uris,
				offset: { position: trackIndex },
			});
			useSpotifyPlaybackRef.current = !!ok;
			if (ok) {
				SetIsPaused(false);
				return;
			}
		} catch (_) {
			useSpotifyPlaybackRef.current = false;
		}

		// Fallback: 30s preview in browser
		if (selected.preview_url && audRef.current) {
			audRef.current.src = selected.preview_url;
			SetIsPaused(false);
			audRef.current.play();
		}
	};

	const onLogOut = () => {
		const urlParams = new URLSearchParams(window.location.search);

		if(urlParams.has("search"))
			urlParams.delete("search")

		window.location.search = urlParams;

		localStorage.clear();
		window.location.reload();
	}
	
	if(!hasLoaded) return <span>LOADING</span>

	if(authError) return <Login onLogin={() => onLogin()} errorMessage={authErrorMessage} />

	return (
		<div className="App" style={{height: 0}}>
			{/* {authError && <button onClick={() => onLogin()}>LOGIN</button>} */}	
			{/* <button onClick={() => localStorage.clear()}>CLEAR STORAGE</button> */}
			{/* <span>{`Error: ${authError}`}</span> */}
			<Tutorial isTutorial={isTutorial}/>
			<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', padding: '0 1rem' }}>
				<SearchBar onSearch={(input, isGenre) => getMusicData(input, isGenre)} isLoading={isLoading} initial={currentSearch}/>
				<GenreDropdown
					onSelectGenre={(genre) => getMusicData(genre, 'genre')}
					disabled={isLoading}
				/>
			</div>
			{isCategoryOpen && <ViewCategoryBar categorys={ViewCategorys} onSelectViewCategory={(cat) => setCurrentCategory(cat)} onHide={() => SetIsCategoryOpen(!isCategoryOpen) }/>}
			<Player onNextSong={onNextSong} songData={currentSongData} onPause={pause => onPause(pause)} paused={isPaused} onLogOut={onLogOut}/>
			<BubbleChart data={dataState} onPlayTrack={(uri, track) => playSong(uri, track)} viewCategory={ViewCategorys[currentCategory]}/>
			<audio ref={audRef} />
		</div>
	);
}

export default App;
