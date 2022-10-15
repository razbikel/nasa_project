
const launchesDataBase = require('./launches.mongo');
const planets = require('./launches.mongo');
const axios = require('axios');

const LATEST_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

const saveLaunch = async (launch) => {
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

const getLatestFlightNumber = async () => {
    const latestLaunch = await launchesDataBase.findOne().sort('-flightNumber');
    if(!latestLaunch){
        return LATEST_FLIGHT_NUMBER
    }
    else{
        return latestLaunch.flightNumber;
    }
}

const launch = {
    flightNumber: 100,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate: new Date('December 27 2040'),
    target: 'kepler 442-b',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true
}

saveLaunch(launch)

const existsLaunchWithId = async (launchId) => {
    return await findLaunch({
        flightNumber: launchId
    })
}

const getAllLaunches = async () => {
    return await launchesDataBase.find({}, {
        '__v':0, '_id': 0
    })
}


const scheduleNewLaunch = async (launch) => {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error('no matching planet found!')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'ZTM'],
        flightNumber: newFlightNumber
    })
    await saveLaunch(newLaunch);
}


const deleteNewLaunch = async (id) => {
    const aborted = await launchesDataBase.findOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1;

}


const findLaunch = async (filter) => {
    return await launchesDataBase.findOne(filter)
}


const populateLaunches = async () =>{
    console.log('downloading launches data...')
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination: false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        name: 1
                    }
                },
                {
                    path:"payloads",
                    select:{
                        customers: 1
                    }
                }
            ]
        }
    })

    if(response.status !== 200){
        console.log('problem downloading launch data')
        throw new Error('Launch data downloading failed!')
    }

    const launch_docs = response.data.docs;
    
    launch_docs.forEach(async launch_doc => {
        const payloads = launch_doc['payloads'];
        const customers = payloads.flatMap(payload => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launch_doc['flight_number'],
            mission: launch_doc['name'],
            rocket: launch_doc['rocket']['name'],
            launchDate: launch_doc['date_local'],
            customers,
            upcoming: launch_doc['upcoming'],
            success: launch_doc['success']
        }

        await saveLaunch(launch)
    
    })
}


const loadLaunchesData = async () => {
    const first_launch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if(first_launch){
        console.log('launch data already loaded!')
    }
    else{
        await populateLaunches();
    }

}


module.exports = {
    getAllLaunches,
    deleteNewLaunch,
    existsLaunchWithId,
    scheduleNewLaunch,
    loadLaunchesData
}