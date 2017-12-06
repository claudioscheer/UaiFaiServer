import mongoose from 'mongoose';

const wifiSchema = mongoose.Schema({
    _id: String,
    createdAt: Date,
    updatedAt: Date,
    location: { type: { type: String }, coordinates: [Number] }
});

const Wifi = mongoose.model('Wifi', wifiSchema);

export default Wifi;