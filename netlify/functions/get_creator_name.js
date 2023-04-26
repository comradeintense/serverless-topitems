// get_creator_name.js
const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

exports.handler = async function (event, context) {
	try {
		const fetch = (await import('node-fetch')).default;
		const apiKey = process.env.STEAM_API_KEY || 'default_api_key';
		const creatorId = event.path.split('/').pop();

		if (!creatorId) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					error: 'No creatorId provided.',
				}),
			};
		}

		const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${creatorId}`;
		const response = await fetch(url);
		const data = await response.json();

		if (
			data.response &&
			data.response.players &&
			data.response.players.length > 0
		) {
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({
					personaname: data.response.players[0].personaname,
				}),
			};
		} else {
			return {
				statusCode: 404,
				headers,
				body: JSON.stringify({
					error: 'User not found or invalid creatorId.',
				}),
			};
		}
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error: 'An error occurred while fetching creator name.',
			}),
		};
	}
};
