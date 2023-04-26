import fetch from 'node-fetch';
const { parse } = require('node-html-parser');

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};

exports.handler = async function (event, context) {
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers,
			body: '',
		};
	}

	try {
		const url =
			'https://steamcommunity.com/workshop/browse/?appid=255710&browsesort=trend&section=readytouseitems';
		const response = await fetch(url);
		const html = await response.text();

		const root = parse(html);
		const workshopItems = root.querySelectorAll('.workshopItem');

		const itemIds = workshopItems
			.map((item) => {
				const anchor = item.querySelector('a');
				return anchor.getAttribute('data-publishedfileid');
			})
			.filter(Boolean);

		const top9Ids = itemIds.slice(0, 9);

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(top9Ids),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Failed to fetch data' }),
		};
	}
};
