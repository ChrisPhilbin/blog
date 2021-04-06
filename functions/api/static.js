const { db } = require('../util/admin');

exports.getOneStaticPage = (request, response) => {
	db
		.collection('static')
		.where('title', '==', request.params.pageName)
		.get()
		.then((doc) => {
            if (!doc.exists) {
                return response.status(404).json()
            }
            staticPageData = doc.data();
			staticPageData.pageId = doc.id;
			return response.json(staticPageData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.createOneStaticPage = (request, response) => {
	if (request.body.title.trim() === '' || request.body.body.trim() === '') {
		return response.status(400).json({ message: 'Name or body fields cannot be empty!' });
	}
	const newStaticPage = {
		title: request.body.name,
		body: request.body.body,
		createdAt: new Date().toISOString()
	}
	db
		.collection('static')
		.add(newStaticPage)
		.then((doc)=>{
			const responseStaticPage = newStaticPage;
			responseStaticPage.id = doc.id;
			return response.status(200).json(responseStaticPage);
		})
		.catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
}