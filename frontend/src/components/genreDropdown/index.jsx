import React, { useEffect, useState } from 'react';
import { getUserGenres } from '../../api/data';
import './index.scss';

const GenreDropdown = ({ onSelectGenre, disabled }) => {
	const [genres, setGenres] = useState([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		getUserGenres()
			.then((list) => {
				if (!cancelled) setGenres(list);
			})
			.catch((err) => {
				if (!cancelled) setError(err?.message || 'Could not load genres');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => { cancelled = true; };
	}, []);

	const handleSelect = (genre) => {
		onSelectGenre(genre);
		setOpen(false);
	};

	return (
		<div className="genre-dropdown">
			<button
				type="button"
				className="genre-dropdown__trigger"
				onClick={() => setOpen((o) => !o)}
				disabled={disabled || loading}
				aria-expanded={open}
				aria-haspopup="listbox"
			>
				{loading ? 'Loading genres…' : error ? 'My genres (unavailable)' : 'My genres'}
			</button>
			{open && (
				<>
					<div className="genre-dropdown__backdrop" onClick={() => setOpen(false)} aria-hidden />
					<ul
						className="genre-dropdown__list"
						role="listbox"
						aria-label="Your top genres"
					>
						{error && (
							<li className="genre-dropdown__item genre-dropdown__item--error" role="option">
								{error}
							</li>
						)}
						{!error && genres.length === 0 && !loading && (
							<li className="genre-dropdown__item genre-dropdown__item--empty" role="option">
								No genres found
							</li>
						)}
						{!error && genres.map((genre) => (
							<li
								key={genre}
								className="genre-dropdown__item"
								role="option"
								onClick={() => handleSelect(genre)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelect(genre);
									}
								}}
								tabIndex={0}
							>
								{genre}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default GenreDropdown;
