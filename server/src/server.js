const app = require('../src/app');
const http = require('http');
const {load_planets} = require('../src/models/planets.model')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://razb:razb3031994@cluster0.zgsp5st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

const run_server = async () => {
    await mongoose.connect(MONGO_URL);
    await load_planets();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}...`)
    })
}

run_server();

