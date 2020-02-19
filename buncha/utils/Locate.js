import * as Location from "expo-location";
import { WEB } from "./Constants";
import { UNKNOWN_LOCATION } from "../store/events";

let currentPostionPromise;

export default function locate() {
  if (WEB) {
    if (!currentPostionPromise) {
      currentPostionPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }).catch(() => {
        throw new Error(UNKNOWN_LOCATION);
      });
    }
    return currentPostionPromise;
  } else {
    return getLocation();
  }
}

async function getLocation() {
  try {
    const location = await Location.getLastKnownPositionAsync();
    return location;
  } catch (error) {}
  const location = await Location.getCurrentPositionAsync({
    enableHighAccuracy: false,
    maximumAge: 15 * 60 * 1000
  });
  return location;
}

export function calculateDistance(lat1, lon1, lat2, lon2, unit) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

export function distanceTo(item) {
  return item.sort && item.sort[item.sort.length - 1];
}

export function roundedDistance(distance, withDot = true) {
  const suffix = withDot ? " · " : "";
  if (distance > 1000) {
    const kMiles = (distance / 1000).toFixed(1);
    return `${kMiles}kmi${suffix}`;
  } else if (distance > 100) {
    const miles = parseInt(distance, 10);
    return `${miles}mi${suffix}`;
  } else {
    const miles = distance.toFixed(1);
    return `${miles}mi${suffix}`;
  }
}

export function roundedDistanceTo(item) {
  const distance = distanceTo(item);
  if (!distance) return null;

  return roundedDistance(distance, false);
}
