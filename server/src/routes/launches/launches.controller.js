const { getAllLaunches, deleteNewLaunch, existsLaunchWithId, scheduleNewLaunch } = require('../../models/launches.model')

const httpGetAllLaunches = async (req, res) => {
    res.status(200).json( await getAllLaunches())
}

const httpAddNewLaunches = (async (req, res) => {
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
        return res.status(400).json({
            "error": "Missing required launch property"
        })
    }
    else{
        launch.launchDate = new Date(launch.launchDate)
        if(isNaN(launch.launchDate)){
            return res.status(400).json({
                "error": "Invalid launchDate"
            })
        }
        // addNewLaunch(launch);
        await scheduleNewLaunch(launch)
        return res.status(201).json(launch);
    }
})

const httpDeleteNewLaunches = ((req,res) => {
    const id = Number(req.params.id);
    if(existsLaunchWithId(id)){
        let aborted = deleteNewLaunch(id);
        res.status(200).json(aborted)
    }
    else{
        res.status(404).json({
            error: "Launch doesnt exists"
        });
    }
})

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpDeleteNewLaunches
}