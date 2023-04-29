// const request = require("request");
const request = require('request-promise-native');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 * https://api.ipify.org?format=json
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  try {
    const url = `https://api.ipify.org?format=json`;
    request(url, (err, resp, body) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (resp.statusCode !== 200) {
        const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const ip = JSON.parse(body)["ip"];
      callback(null, ip);
    });
  } catch (error) {
    console.log(
      "An error has occured during the request. Check your endpoint and try again."
    );
  }
};

const fetchCoordsByIP = (ip, callback) => {
  try {
    request(`http://ipwho.is/${ip}`, (err, resp, body) => {
      if (err) {
        callback(err, null);
        return;
      }
      const parsedBody = JSON.parse(body);

      if (!parsedBody.success) {
        const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
        callback(Error(message), null);
        return;
      }

      const { latitude, longitude } = parsedBody;

      callback(null, { latitude, longitude });
    });
  } catch (error) {
    console.log(
      "An error has occured during the request. Check your endpoint and try again."
    );
  }
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`
        ),
        null
      );
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
