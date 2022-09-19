const axios = require('axios')

async function httpGetPlanets() {
  const response = await axios.get('http://localhost:8000/planets');
  return response.data

  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await axios.get('http://localhost:8000/launches');
  const launches = await response.data;
  return launches.sort((a,b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try{
    return await axios.post('http://localhost:8000/launches', launch);

  }
  catch(error){
    return{
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await axios.delete(`http://localhost:8000/launches/${id}`);

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