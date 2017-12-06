import {
    wifiService,
} from '../service';

const wifiRouter = (app) => {
    app.post('/api/auth/add-wifi', async (req, res) => {
        const user = req.get('Authorization');
        if (req.body) {
            wifiService.save(req.body, user);
        }
        res.send();
    });

    app.get('/api/auth/get-wifi-networks/:timeLimit/:northEast/:southWest', async (req, res) => {
        let wifis = await wifiService.getWifiNetworks(
            req.params.timeLimit,
            req.params.northEast.split(','),
            req.params.southWest.split(',')
        );
        res.send(wifis);
    });
}

export default wifiRouter;