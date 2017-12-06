import mongoose from 'mongoose';

const userLoginSchema = mongoose.Schema({
    _id: String,
    loggedTimes: [Date],
});

const UserLogin = mongoose.model('UserLogin', userLoginSchema);

export default UserLogin;