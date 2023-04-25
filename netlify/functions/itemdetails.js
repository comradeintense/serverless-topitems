exports.handler = async function (event, context) {
	try {
		const fetch = (await import('node-fetch')).default;
		const apiKey = process.env.STEAM_API_KEY || 'default_api_key';
		const itemId = event.pathParameters.itemId;
		const url = `https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=${apiKey}&publishedfileids[0]=${itemId}&includevotes=true`;

		const response = await fetch(url);
		const data = await response.json();

		return {
			statusCode: 200,
			body: JSON.stringify(data),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'An error occurred while fetching item details.',
			}),
		};
	}
};