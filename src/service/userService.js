import {
    User,
} from '../model';

import {
    userLoginService,
} from '../service';

class UserService {

    async registerUser(user) {
        const dateNow = new Date();
        let userRegistered = await this.getUser(user._id);
        if (userRegistered) {
            await User.update({ _id: userRegistered._id }, userRegistered);
        }
        else {
            userRegistered = { ...user };
            userRegistered.createdAt = dateNow;
            await User.create(userRegistered);
        }
        await userLoginService.saveUserLogin(userRegistered._id, dateNow);
        return userRegistered;
    }

    getUser(googleUserId) {
        return User.findById(googleUserId);
    }
}

const userService = new UserService();
export default userService;