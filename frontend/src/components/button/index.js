import React from 'react';
import './index.scss';

const Button = ({ title, onClick, red }) => {
	if (red) {
		return <button className="button-generic-container blue" onClick={() => onClick()}>{title}</button>
	}
	
	return (
		<button className="button-generic-container" onClick={() => onClick()}>{title}</button>
	)
}

export default Button;