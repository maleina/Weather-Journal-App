/* Global Variables */

/* Set constants for Open Weather API request */
const apiKey = '598437caebebff1517fc1c8defdab093';
const weatherURL = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&zip=';

/* Create a new date instance dynamically with JS */
const months = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];
let d = new Date();
let newDate = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();

/* Event listener for button */
document.getElementById('generate').addEventListener('click', updateJournal);

/* Function called upon click on Generate button */
function updateJournal() {
    const zip = document.getElementById('zip').value;
    const userFeelings = document.getElementById('feelings').value;

    getWeatherData(weatherURL, zip, apiKey)
        .then(function(data) {
            console.log(data);
            postData('/add', { temperature: data.main.temp + ' &#176 F', date: newDate, feelings: userFeelings });
        })
        .then(updateUI);
}

/* Function to GET weather data from external Open Weather Map API */
const getWeatherData = async (baseURL, zip, apiKey) => {
    const res = await fetch(baseURL + zip + '&appid=' + apiKey);
    try {
        // Parse the data before returning the data
        const data = await res.json();
        return data;
    } catch (error) {
        // Handle any errors
        console.log("error", error);

    }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        // Parse and log the posted data to the console
        const newData = await res.json();
        console.log(newData);
    } catch (error) {
        // Handle any errors
        console.log("error", error);
    }
}

/* Update the UI with the data the user enterred plus the temperature */
const updateUI = async () => {
    const res = await fetch('/all');
    try {
    	// Update the UI with the values returned from the server
        const allData = await res.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temperature;
        document.getElementById('content').innerHTML = allData.feelings;

    } catch (error) {
    	// Handle any errors
        console.log("error", error);
    }
}