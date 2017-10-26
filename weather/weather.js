const yargs = require('yargs');
const request = require('request');


let getWeather = (lat, lng, callback) => {
    request({
        url : `https://api.darksky.net/forecast/ccccdcb0c27d2aec7d5bdbbd564e580a/${lat},${lng}`,
        json : true
    }, (err, response, body) => {
        if (err) { // err -> unable to connect to the server.
            callback(err);

            //console.log("unable to connect to forecast.io server.");
        } else if (response.statusCode === 400) { // now it is 404
            callback("unable to fetch weather.");
        } else if (!err && response.statusCode === 200) {
            //console.log(response);

            callback(undefined, {
                temperature : body.currently.temperature,
                apparentTemperature : body.currently.apparentTemperature,
                timezone : body.timezone,
            });

            // console.log("timezone : ", body.timezone);
            // console.log("current temperature : ", body.currently.temperature, " F");
        } else {
            console.log("Unable to fetch weather.");
        }
    });
};

module.exports.getWeather = getWeather;