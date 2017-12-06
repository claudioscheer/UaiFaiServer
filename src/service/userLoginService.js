import {
    UserLogin,
} from '../model';

class UserLoginService {

    async saveUserLogin(googleUserId, dateNow) {
        let userLogin = await this.getUserLogin(googleUserId);
        if (userLogin) {
            userLogin.loggedTimes.push(dateNow);
            await UserLogin.update({ _id: googleUserId }, userLogin);
        }
        else {
            userLogin = { _id: googleUserId };
            userLogin.loggedTimes = [dateNow];
        }
        return userLogin;
    }

    async getUserLogin(googleUserId) {
        return await UserLogin.findById(googleUserId);
    }
}

const userLoginService = new UserLoginService();
export default userLoginService;