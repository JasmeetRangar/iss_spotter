const { nextISSTimesForMyLocation } = require('./iss_promised');
nextISSTimesForMyLocation()
  .then((passTimes) => {
    for (let time of passTimes) {
      let date = new Date(0);
      date.setUTCSeconds(time.risetime);
      let duration = time.duration;
      console.log(`Next pass at ${date} for ${duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });