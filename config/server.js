import Constants from 'expo-constants';

// Try to infer the development machine IP from Expo debuggerHost so physical devices can reach the local server.
const debuggerHost = (Constants.manifest && Constants.manifest.debuggerHost) || (Constants.manifest2 && Constants.manifest2.debuggerHost) || null;
let host = 'localhost';
if (debuggerHost) {
	try {
		host = debuggerHost.split(':')[0];
	} catch (e) {
		host = 'localhost';
	}
}

export const SERVER_URL = `http://${host}:4000`;
