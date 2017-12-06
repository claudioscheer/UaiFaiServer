import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

import registerRouter from './router';
import config from '../config.json';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, { useMongoClient: true });
const connectionDB = mongoose.connection;

connectionDB.on('error', (error) => {
	throw error;
	process.exit(1);
});
connectionDB.once('open', () => {
	const app = express();
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(morgan(':method :url :status :res[content-length] [:date[iso]] - :response-time ms - Authorization: :req[Authorization]'));

	registerRouter(app);

	app.listen(3000, () => {
		console.log('UaiFai listening on port 3000.');
	});
});