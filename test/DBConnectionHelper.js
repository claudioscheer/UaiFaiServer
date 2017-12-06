import mongoose from 'mongoose';

import config from '../config.json';

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongoUrl, { useMongoClient: true });
        const connectionDB = mongoose.connection;

        connectionDB.on('error', (error) => {
            reject(error);
        });
        connectionDB.once('open', () => {
            resolve({ success: true, db: connectionDB });
        });
    });
}

export default connect;