import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id: String,
    createdAt: Date,
    googleUserName: String,
    googleUserEmail: String,
});

const User = mongoose.model('User', userSchema);

export default User;