//
// 실행하려면 node weather-app.js 로 해야 한다.
//
// forecast.io -> developer.forecast.io
//
//
//

const yargs = require('yargs');
const request = require('request');

const geocode = require('./geocode/geocode.js');
const weather = require('./weather/weather.js');
//https://api.darksky.net/forecast/ccccdcb0c27d2aec7d5bdbbd564e580a/37.8267,-122.4233

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

geocode.geocodeAddress(argv.a, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        weather.getWeather(results.latitude, results.longitude, (err, weatherResults) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`In ${weatherResults.timezone}, it's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}`);
                //console.log(JSON.stringify(weatherResults, undefined, 2));
            }
        });
    }
});


//weather.getWeather(results);

// geocode.geocodeAddress(argv.a, (errorMessage, results) => {
//     if (errorMessage) {
//         console.log(errorMessage);
//     } else {
//         //console.log(JSON.stringify(results, undefined, 2));
//         request({
//             url : `https://api.darksky.net/forecast/ccccdcb0c27d2aec7d5bdbbd564e580a/${results.latitude},${results.longitude}`,
//             json : true
//         }, (err, response, body) => {
//             if (err) { // err -> unable to connect to the server.
//                 console.log("unable to connect to forecast.io server.");
//             } else if (response.statusCode === 400) { // now it is 404
//                 console.log("unable to fetch weather.");
//             } else if (!err && response.statusCode === 200) {
//                 //console.log(response);
//                 console.log("timezone : ", body.timezone);
//                 console.log("current temperature : ", body.currently.temperature, " F");
//             } else {
//                 console.log("Unable to fetch weather.");
//             }
//         })
//     }
// });