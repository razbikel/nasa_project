const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})


const mongoConnect = async () => {
    try{
        await mongoose.connect(MONGO_URL);
    }
    catch(e){
        console.log('mongo connect error', e);
    }
}

const mongoDisconnect = async () => {
    try{
        await mongoose.disconnect();
    }
    catch(e){
        console.log('mongo disconnect error', e);
    }
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}