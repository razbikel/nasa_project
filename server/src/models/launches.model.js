const launches = new Map();

const launchesDataBase = require('./launches.mongo');
const planets = require('./launches.mongo');

let lastFlightNumber = 100;
const LATEST_FLIGHT_NUMBER = 100;

const saveLaunch = async (launch) => {

    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error('no matching planet found!')
    }

    await launchesDataBase.updateOne({
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

const existsLaunchWithId = (launchId) => {
    return launches.has(launchId);
}

const getAllLaunches = async () => {
    // return Array.from(launches.values())
    return await launchesDataBase.find({}, {
        '__v':0, '_id': 0
    })
}


const scheduleNewLaunch = async (launch) => {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'ZTM'],
        flightNumber: newFlightNumber
    })
    await saveLaunch(newLaunch);
}


const deleteNewLaunch = (id) => {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    deleteNewLaunch,
    existsLaunchWithId,
    scheduleNewLaunch
}