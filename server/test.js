const { google } = require('googleapis');

const YOUR_CLIENT_ID = '592944968932-p2h545v765tak1io9m2bqoug4fvkp2c9.apps.googleusercontent.com';
const YOUR_REDIRECT_URL = 'http://localhost:5173';

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  '',
  YOUR_REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});
console.log('Authoriz', authorizeUrl);
