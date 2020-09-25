import React, { useState } from 'react';
import './index.scss';
import Button from '../button';

const SearchBar = ({ onSearch, isLoading }) => {
	const [searchQuery, setSearchQuery] = useState('indie')

	return (
		<form className="seachbar-container"  onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery);}}>
			<input onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>
			<div className="searchbar-button"><Button title={isLoading ? "Finding New Tunes" : "Search"} onClick={() => { return;}}/></div>
		</form>
	)
}

export default SearchBar;