import React from 'react';
import './index.scss';
import Button from '../button';

const Login = ({ onLogin, errorMessage }) => {
	return (
		<div className="login-container">
			<div id="login-center-container">
				<div className="logo"></div>
				<span>Please Authorize with Spotify</span>
				{errorMessage && (
					<p className="login-error" style={{ color: '#e74c3c', marginTop: 8, marginBottom: 8, fontSize: 14 }}>
						{errorMessage}
					</p>
				)}
				<div className="login-button"><Button title="Authorize" onClick={() => onLogin()} /></div>
			</div>
		</div>
	)
}

export default Login;
