import React from 'react';
import './index.css';
import Button from '../button';

const Login = ({ onLogin }) => {
	return (
		<div className="login-container">
			<div id="login-center-container">
				<span>To Continue.. Please Authorize with Spotify</span>
				<div className="login-button"><Button title="Authorize" onClick={() => onLogin()} /></div>
			</div>
		</div>
	)
}

export default Login;