const { getAllLaunches, deleteNewLaunch, existsLaunchWithId, scheduleNewLaunch } = require('../../models/launches.model')
const { getPagination } = require('../../services/query');

const httpGetAllLaunches = async (req, res) => {
    const {skip, limit} = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)
    res.status(200).json(launches)
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
        await scheduleNewLaunch(launch)
        return res.status(201).json(launch);
    }
})

const httpDeleteNewLaunches = (async (req,res) => {
    const id = Number(req.params.id);
    if(await existsLaunchWithId(id)){
        let aborted = await deleteNewLaunch(id);
        if(!aborted){
            res.status(400).json({
                error: 'Launch not aborted!'
            })
        }
        res.status(200).json({
            ok: true
        })
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