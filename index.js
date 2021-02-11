
const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, array) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (let time of array) {
    let date = new Date(0);
    date.setUTCSeconds(time.risetime);
    let duration = time.duration;
    console.log(`Next pass at ${date} for ${duration} seconds!`);
  }
});

