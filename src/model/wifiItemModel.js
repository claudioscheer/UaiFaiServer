import mongoose from 'mongoose';

const wifiItemSchema = mongoose.Schema({
    createdAt: Date,
    wifiId: String,
    googleUserId: String,
    power: Number,
    distanceToAccessPoint: Number,
    location: { type: { type: String }, coordinates: [Number] }
});

const WifiItem = mongoose.model('WifiItem', wifiItemSchema);

export default WifiItem;