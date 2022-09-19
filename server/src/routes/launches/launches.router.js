const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunches, httpDeleteNewLaunches } = require('./launches.controller')

const launchesRouter = express.Router();
launchesRouter.get('/',httpGetAllLaunches)
launchesRouter.post('/',httpAddNewLaunches)
launchesRouter.delete('/:id',httpDeleteNewLaunches)




module.exports = launchesRouter;