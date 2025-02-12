const API_URL = "http://localhost:8000/api/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`);
  const data = await res.json();
  return data;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const data = await res.json();
  return data.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
