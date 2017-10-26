//
// if we use promise, then we can avoid deeper indentation.
//
//
//
//
//
//
//
//



const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.options({
    a : {
        demand : true,
        alias : 'address',
        describe : 'Address to fetch weather for.',
        string : true // the arguments will be string.
    }})
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);

let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

// axios automatically parse json data.
axios.get(geocodeURL).then(res => {
    if (res.data.status === "ZERO_RESULTS") {
        throw new Error('Unable to find that address.');
    } else {
        let lat = res.data.results[0].geometry.location.lat;
        let lng = res.data.results[0].geometry.location.lng;

        let weatherURL = `https://api.darksky.net/forecast/ccccdcb0c27d2aec7d5bdbbd564e580a/${lat},${lng}`;
        console.log(res.data.results[0].formatted_address);

        return axios.get(weatherURL); // this returns promise.
    }
}).then(res => {
    // print the weather info.
    let temperature = res.data.currently.temperature;
    let apparentTemperature = res.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
})
    .catch(err => {
    if (err.code === "ENOTFOUND") {
        console.log("Unable to connect to API servers.");
    } else {
        console.log(err.message);
    }
});