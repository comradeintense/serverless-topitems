const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

exports.handler = async function (event, context) {
	try {
		const fetch = (await import('node-fetch')).default;
		const apiKey = process.env.STEAM_API_KEY || 'default_api_key';
		const appId = 255710;

		const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${apiKey}&appid=${appId}`;
		const response = await fetch(url);
		const data = await response.json();

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(data),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error:
					'An error occurred while fetching the current number of players.',
			}),
		};
	}
};
