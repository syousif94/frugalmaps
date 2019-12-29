import * as Location from "expo-location";
import { ANDROID, WEB } from "./Constants";

export default function locate() {
  if (WEB) {
    return Location.getCurrentPositionAsync({
      enableHighAccuracy: false,
      maximumAge: 15 * 60 * 1000
    });
  } else {
    return Location.getLastKnownPositionAsync();
  }
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
