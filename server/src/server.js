const app = require('../src/app');
const http = require('http');
const {load_planets} = require('../src/models/planets.model')
const {mongoConnect} = require('./services/mongo')

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const run_server = async () => {
    await mongoConnect();
    await load_planets();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}...`)
    })
}

run_server();

