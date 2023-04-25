const { parse } = require('node-html-parser');

exports.handler = async function (event, context) {
	try {
		const fetch = (await import('node-fetch')).default;
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
			body: JSON.stringify(top9Ids),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to fetch data' }),
		};
	}
};
