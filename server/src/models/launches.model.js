const launches = new Map();

const launchesDataBase = require('./launches.mongo');
const planets = require('./launches.mongo');

let lastFlightNumber = 100;

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

// launches.set(launch.flightNumber, launch);
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



const addNewLaunch = (launch) => {
    lastFlightNumber++;
    launches.set(lastFlightNumber, Object.assign(launch,
    {
        upcoming: true,
        success: true,
        customers: ['NASA', 'ZTM'],
        flightNumber: lastFlightNumber
    }))
}

const deleteNewLaunch = (id) => {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    deleteNewLaunch,
    existsLaunchWithId
}