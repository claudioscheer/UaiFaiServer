import {
    Wifi,
    WifiItem,
} from '../model';

class WifiService {

    async save(wifiNetworks, user) {
        return new Promise(() => {
            const adjustedWifiNetworks = this.groupWifiNetworks(wifiNetworks);
            return Promise.all(
                Object.getOwnPropertyNames(adjustedWifiNetworks).map(async (wifiKey) => {
                    const wifiNetwork = adjustedWifiNetworks[wifiKey];
                    const readingDates = wifiNetwork.wifis.map(x => x.createdAt);
                    // Sort ascending.
                    readingDates.sort((x, y) => {
                        return Date.parse(x) - Date.parse(y);
                    });
                    const greaterDate = new Date(readingDates[readingDates.length - 1]);
                    const locations = wifiNetwork.wifis.map(x => x.location);

                    const wifiAlreadySaved = await this.getWifi(wifiKey);
                    if (wifiAlreadySaved) {
                        locations.push(wifiAlreadySaved.location);
                        await Wifi.update({ _id: wifiAlreadySaved._id },
                            {
                                updatedAt: wifiAlreadySaved.updatedAt < greaterDate ? greaterDate : wifiAlreadySaved.updatedAt,
                                location: this.locationsCenterPoint(locations),
                            });
                    }
                    else {
                        await Wifi.create({
                            _id: wifiKey,
                            createdAt: greaterDate,
                            updatedAt: greaterDate,
                            location: this.locationsCenterPoint(locations),
                        });
                    }
                    await WifiItem.create(
                        wifiNetwork.wifis.map(x => (
                            {
                                ...x,
                                googleUserId: user,
                                wifiId: wifiKey,
                            }
                        ))
                    );
                })
            );
        });
    }

    locationsCenterPoint(locations) {
        // https://gis.stackexchange.com/questions/12120/calculate-midpoint-from-a-series-of-latitude-and-longitude-coordinates
        const length = locations.length;
        const sumLatitudes = locations.reduce((sum, x) => sum + x.coordinates[0], 0);
        const sumLongitudes = locations.reduce((sum, x) => sum + x.coordinates[1], 0);
        return { type: 'Point', coordinates: [sumLatitudes / length, sumLongitudes / length] };
    }

    // Group wifi datas by BSSID and SSID (key).
    groupWifiNetworks(wifiNetworks) {
        let adjustedWifiNetworks = {};
        wifiNetworks.map((wifi) => {
            if (adjustedWifiNetworks[wifi.key]) {
                adjustedWifiNetworks[wifi.key].wifis.push(wifi);
            }
            else {
                adjustedWifiNetworks[wifi.key] = {
                    createdAt: wifi.createdAt,
                    updatedAt: wifi.createdAt,
                };
                adjustedWifiNetworks[wifi.key].wifis = [wifi];
            }
        });
        return adjustedWifiNetworks;
    }

    async getWifi(id) {
        return Wifi.findById(id);
    }

    async getWifiNetworks(timeLimit, northEast, southWest) {
        let date = new Date(new Date().getTime() + (timeLimit * -1) * 60000);
        const polygonCoordinates = [
            [+southWest[0], +northEast[1]],
            [+northEast[0], +northEast[1]],
            [+northEast[0], +southWest[1]],
            [+southWest[0], +southWest[1]],
            [+southWest[0], +northEast[1]]
        ];

        return Wifi.find({
            //updatedAt: { $gt: date },
            location: {
                $geoWithin: {
                    $geometry: {
                        type: 'Polygon',
                        coordinates: [polygonCoordinates],
                    }
                }
            }
        });
    }
}

const wifiService = new WifiService();
export default wifiService;