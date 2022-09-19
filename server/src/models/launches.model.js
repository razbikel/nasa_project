const launches = new Map();

let lastFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => {
    return launches.has(launchId);
}

const getAllLaunches = () => {
    return Array.from(launches.values())
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