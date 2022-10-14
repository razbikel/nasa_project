const axios = require('axios')

const API_URL = `http://localhost:8000/v1`

async function httpGetPlanets() {
  const response = await axios.get(`${API_URL}/planets`);
  return response.data

  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await axios.get(`${API_URL}/launches`);
  const launches = await response.data;
  return launches.sort((a,b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try{
    
    return await axios.post(`${API_URL}/launches`, launch);

  }
  catch(error){
    return{
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await axios.delete(`${API_URL}/launches/${id}`);

  }
  catch(error){
    return{
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};