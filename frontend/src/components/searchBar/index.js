import React, { useEffect, useState } from 'react';
import './index.scss';
import Button from '../button';
import SearchData from '../../data/searchData';

const SearchBar = ({ onSearch, isLoading, initial }) => {
	const [searchQuery, setSearchQuery] = useState(initial)
	const [auto, SetAuto] = useState([]);
	const [isAutoHidden, setIsAutoHidden] = useState(true)
	const [isGenreSearch, setIsGenreSearch] = useState(true)

	const onEscape = (event) => {
		if (event.keyCode === 27) {
			setIsAutoHidden(true);
		}
	}

	useEffect(() => {
		SetAuto(SearchData);

		document.addEventListener('keydown',(e) => onEscape(e), false);

		return () => {
			document.removeEventListener('keydown', onEscape, false);
		}
	}, []);


	const onChangeSearch = (val) => {
		const newSeach = SearchData.filter(a => a.includes(val))
		SetAuto(val === "" ? [] : newSeach);
		setSearchQuery(val)

		if(isGenreSearch)
		setIsAutoHidden(false);
		else
		setIsAutoHidden(true);
	}

	const onSearchInput = (e) => {
		e.preventDefault(); 
		onSearch(searchQuery);

			setIsAutoHidden(true);
		
	}


	return (

		<form className="seachbar-container" onSubmit={(e) => onSearchInput(e)}>
			<div className="search-bar-input" style={{height: (isAutoHidden) ? '3rem' : '35rem'}}>
				<input onChange={e => onChangeSearch(e.target.value)} value={searchQuery}></input>
				{ (!isAutoHidden) && <div className="search-auto-container">
					{auto.map(fill => (
						<button onClick={() => {onChangeSearch(fill); setIsAutoHidden(true);}} className="search-bar-auto">
							<h3>{fill}</h3>
						</button>
					))}
				</div>}
			</div>	
			<div className="searchbar-button">
				<Button red={!isGenreSearch} title={isLoading ? "Stop" : `Search ${isGenreSearch ? 'Genre' : 'Artist' }`} onClick={() => { return; }} />
{				!isLoading && <button type="button" onClick={() => setIsGenreSearch(!isGenreSearch) }> Or Search By {isGenreSearch ? 'Artist' : 'Genre' }</button>
}				{/* <Button red title={isLoading ? "Finding New Tunes" : "Search Artist"} onClick={() => { return; }} /> */}
			</div>
			</form>

	)
}

export default SearchBar;