const { getAllPlanets } = require('../../models/planets.model')


const httpGetAllPlanets = (req, res) => {
    const planets = getAllPlanets();
    return res.status(200).json(planets);
}

module.exports = {
    httpGetAllPlanets
};