import {
    userService,
} from '../service';

const userRouter = (app) => {
    app.post('/api/sign-in', async (req, res) => {
        await userService.registerUser(req.body);
        res.status(200).send({});
    });
}

export default userRouter;