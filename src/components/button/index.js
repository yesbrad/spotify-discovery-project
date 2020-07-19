import React from 'react';
import './index.css';

const Button = ({ title, onClick }) => {
	return (
		<button className="button-generic-container" onClick={() => onClick()}>{title}</button>
	)
}

export default Button;