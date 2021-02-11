import * as functions from 'firebase-functions';
export const redirect_uri = 'http://localhost:3000/'; 
//export const redirect_uri = 'https://spotify-discovery.web.app/'
//export const redirect_uri = 'https://newsongsfanks.com.au/'

const crypto = require('crypto');

const express = require('express');
const cors = require('cors');

const key = 'e7e689f93e1d4e23b8476bfc0aaf5d61';

const app = express();
app.use(cors());

app.get('/login', (request: any, response: any) => {
	//response.redirect('http://google.com')
	const verifier = base64URLEncode(crypto.randomBytes(32));
	const hash = base64URLEncode(sha256(verifier));
	response.send({
		url: `https://accounts.spotify.com/authorize?response_type=code&client_id=${key}&redirect_uri=${redirect_uri}&code_challenge_method=S256&code_challenge=${hash}&scope=user-modify-playback-state user-read-playback-state user-library-modify`,
		verifier,
	});
});


const base64URLEncode = (str: any) => {
	return str.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

const sha256 = (buffer: any) => {
	return crypto.createHash('sha256').update(buffer).digest();
}


exports.api = functions.https.onRequest(app);
