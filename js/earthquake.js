// Initialize variables to store earthquake data
let allEarthquakes = [];

// States to help filter earthquake data   
const state = {
    startDate: getOneWeekAgoDate(), 
    endDate: getTodayDate(),
    magnitude: 0
};

// Get today's date in yyyy-mm-dd format
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get the date one week before today in yyyy-mm-dd format
function getOneWeekAgoDate() {
    let today = new Date();
    today.setDate(today.getDate() - 7); // Subtract 7 days
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function fetchEarthquakeData() {
    // API call to fetch earthquake data
    const geoURL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=100&starttime=${state.startDate}&endtime=${state.endDate}&minmagnitude=${state.magnitude}`;

    fetch(geoURL)
        .then(response => response.json())
        .then(data => {
            allEarthquakes = data.features; // Store all earthquakes data
            processEarthquakeData(allEarthquakes); // Process and display all earthquakes
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Process and display earthquake data
function processEarthquakeData(earthquakes) {
    const earthquakePoints = earthquakes.map(eq => {
        const date = new Date(eq.properties.time);
        const formattedTime = date.toLocaleString(); // Adjust formatting as needed

        return { // Return point data including magnitude, location, time
            id: eq.id,
            title: `Magnitude: ${eq.properties.mag}`, 
            location: eq.properties.place, 
            time: formattedTime, 
            geometry: { type: "Point", coordinates: [eq.geometry.coordinates[0], eq.geometry.coordinates[1]] },
            radius: Math.max(4, eq.properties.mag * 2) // Adjust the radius
        };
    });

    // Add the earthquake points to the citySeries
    citySeries.data.setAll(earthquakePoints);
}