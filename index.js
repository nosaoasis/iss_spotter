const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require("./iss");

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work", error);
//     return;
//   }

//   console.log("It worked! Returned IP", ip);
// });

fetchCoordsByIP("102.89.34.188", (err, data) => {
  if (err) {
    console.log("An error occured", err)
    return
  }
  console.log("All is well and good", data)
})
