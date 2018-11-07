import { Dimensions, Platform } from "react-native";

export const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];

export const DEV = process.env.NODE_ENV === "development";

export const INITIAL_REGION = {
  latitude: 33.229236835987024,
  longitude: -97.667684070742538,
  latitudeDelta: 36.821960277931375,
  longitudeDelta: 67.450574587921707
};

export const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const os = Platform.OS;

export const ANDROID = os === "android";
export const IOS = os === "ios";
