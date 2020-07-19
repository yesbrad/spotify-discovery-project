import React, { useState } from 'react';
import './index.css';
import Button from '../button';

const SearchBar = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('indie')

	return (
		<form className="seachbar-container"  onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery);}}>
			<input onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>
			<div className="searchbar-button"><Button title="Search" onClick={() => onSearch(searchQuery)}/></div>
		</form>
	)
}

export default SearchBar;