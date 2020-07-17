import React, { useState } from 'react';
import './index.css';

const SearchBar = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('indie')

	return (
		<form className="seachbar-container"  onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery);}}>
			<input onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>
			<button >Search</button>
		</form>
	)
}

export default SearchBar;