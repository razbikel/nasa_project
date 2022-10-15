const app = require('../src/app');
const http = require('http');
const {load_planets} = require('../src/models/planets.model')
const {mongoConnect} = require('./services/mongo')
const{loadLaunchesData} = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const run_server = async () => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    await mongoConnect();
    await load_planets();
    await loadLaunchesData();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}...`)
    })
}

run_server();

