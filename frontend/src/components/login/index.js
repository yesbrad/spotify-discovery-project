import React from 'react';
import './index.scss';
import Button from '../button';

const Login = ({ onLogin }) => {
	return (
		<div className="login-container">
			<div id="login-center-container">
				<h1>newsongsfanks.com.au</h1>
				<span>Please Authorize with Spotify grr.</span>
				<div className="login-button"><Button title="Authorize" onClick={() => onLogin()} /></div>
			</div>
		</div>
	)
}

export default Login;