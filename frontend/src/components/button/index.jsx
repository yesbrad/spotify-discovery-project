import React from 'react';
import './index.scss';

const Button = ({ title, onClick, red, type = 'button' }) => {
	if (red) {
		return <button type={type} className="button-generic-container blue" onClick={() => onClick?.()}>{title}</button>
	}
	
	return (
		<button type={type} className="button-generic-container" onClick={() => onClick?.()}>{title}</button>
	)
}

export default Button;
