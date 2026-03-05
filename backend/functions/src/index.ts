import * as functions from 'firebase-functions';

// Default redirect URI for Spotify OAuth.
// Spotify requires explicit loopback (127.0.0.1 or [::1]), not localhost.
// This is used only if the frontend does not pass redirect_uri to /login.
export const redirect_uri = 'http://127.0.0.1:3000/';
// For production you can change this default to your live URL, e.g.:
// export const redirect_uri = 'https://slapseeker.com/';

const crypto = require('crypto');

const express = require('express');
const cors = require('cors');

// Spotify client ID (public identifier, not secret).
const key = 'e7e689f93e1d4e23b8476bfc0aaf5d61';

const app = express();
app.use(cors());

app.get('/login', (request: any, response: any) => {
	const requestedRedirect =
		typeof request.query.redirect_uri === 'string'
			? request.query.redirect_uri
			: undefined;
	const finalRedirect = requestedRedirect || redirect_uri;

	const verifier = base64URLEncode(crypto.randomBytes(32));
	const hash = base64URLEncode(sha256(verifier));

	// Spotify: space-separated scope list, no extra encoding of the scope param value
	const scope =
		'user-library-modify user-top-read user-modify-playback-state user-read-playback-state';

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: key,
		redirect_uri: finalRedirect,
		code_challenge_method: 'S256',
		code_challenge: hash,
		scope,
	});

	response.send({
		url: `https://accounts.spotify.com/authorize?${params.toString()}`,
		verifier,
	});
});

const base64URLEncode = (str: any) => {
	return str
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};

const sha256 = (buffer: any) => {
	return crypto.createHash('sha256').update(buffer).digest();
};

exports.api = functions.https.onRequest(app);
