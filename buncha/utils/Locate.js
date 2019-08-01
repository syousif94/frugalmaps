import * as Location from "expo-location";
import { ANDROID, WEB } from "./Constants";

export default function locate() {
  return Location.getCurrentPositionAsync({
    enableHighAccuracy: ANDROID || WEB,
    maximumAge: 15 * 60 * 1000
  });
}

export function distanceTo(item) {
  return item.sort && item.sort[item.sort.length - 1];
}
