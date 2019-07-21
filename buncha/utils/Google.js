const GoogleMapsLoader = require("google-maps");
GoogleMapsLoader.LIBRARIES = ["places"];
GoogleMapsLoader.KEY = "AIzaSyCMw-fDD28DLB0eWIR6PJQrDQfArisLvjw";

export const mapsApi = new Promise((resolve, reject) => {
  GoogleMapsLoader.load(google => {
    resolve(google);
  });
});
