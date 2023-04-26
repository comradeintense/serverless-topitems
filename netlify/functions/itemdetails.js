const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

exports.handler = async function (event, context) {
	try {
		const fetch = (await import('node-fetch')).default;
		const apiKey = process.env.STEAM_API_KEY || 'default_api_key';
		console.log(`API Key: ${apiKey}`);
		const itemId = event.path.split('/').pop();

		if (!itemId) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					error: 'No itemId provided.',
				}),
			};
		}

		const url = `https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=${apiKey}&publishedfileids[0]=${itemId}&includevotes=true`;
		console.log(`Request URL: ${url}`);

		const response = await fetch(url);
		const data = await response.json();
		console.log(`Response data: ${JSON.stringify(data)}`);

		if (
			data.response &&
			data.response.publishedfiledetails &&
			data.response.publishedfiledetails[0].result !== 1
		) {
			return {
				statusCode: 404,
				headers,
				body: JSON.stringify({
					error: 'Item not found or invalid itemId.',
				}),
			};
		}

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
				error: 'An error occurred while fetching item details.',
			}),
		};
	}
};
