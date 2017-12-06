import userRouter from './userRouter';
import wifiRouter from './wifiRouter';
import userService from '../service/userService';

const registerRouter = (app) => {
    app.all('/api/auth/*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        }
        userAuthentication(req, res, next);
    });

    userRouter(app);
    wifiRouter(app);

    app.use((req, res, next) => {
        res.status(404).send('Router not found.');
    });
}

const userAuthentication = async (req, res, next) => {
    const authorization = req.get('Authorization');
    const user = await userService.getUser(authorization);
    if (!user) {
        res.status(403).send('Forbidden. User not found.');
    } else {
        next();
    }
}

export default registerRouter;