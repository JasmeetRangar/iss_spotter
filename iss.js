const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (err, resp, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //console.log(resp);
    const jsonObject = JSON.parse(body).ip;
    callback(null, jsonObject);
  });
};
const fetchCoordsByIP = (ip, callback) => {  
  let url = 'https://freegeoip.app/json/' + ip;  
  request(url, (err, resp, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching corrdinate Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // console.log(body);
    const jsonObject = {};
    jsonObject.latitude = JSON.parse(body).latitude;
    jsonObject.longitude = JSON.parse(body).longitude;
    callback(null, jsonObject);
  });
}
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  let lat = coords.latitude;
  let lon = coords.longitude;
  let url = 'http://api.open-notify.org/iss-pass.json?lat=' + lat + '&lon=' + lon;  
  request(url, (err, resp, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching times Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).response);
  });
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
  if (error) {
    return callback(error, null);
  }
  console.log('It worked! Returned IP:' , ip);
  fetchCoordsByIP(ip, (error, data) => {
    if(error) {
      return callback(error, null);
    }
    console.log(data);
    fetchISSFlyOverTimes(data, (error, array) => {
      if(error) {
        return callback(error, null);
      }
      return callback(null, array)
    })
  });  
});
}
module.exports = { 
                    nextISSTimesForMyLocation
};
