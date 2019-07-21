import { Dimensions, Platform } from "react-native";

export const AWSCF = "https://dwrg27ehb8gnf.cloudfront.net/";

export const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];

export const ABBREVIATED_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

export const ISO_DAYS = [1, 2, 3, 4, 5, 6, 0];

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
export const WEB = os === "web";

export const PLACEMENT_ID = IOS
  ? "1931177036970533_1956753154412921"
  : "1931177036970533_1991298450958391";

export const EVENT_TYPES = [
  "21+",
  "Happy Hour",
  "Beer",
  "Wine",
  "Margs",
  "Wells",
  "Shots",
  "Martinis",
  "Mimosas",
  "Sangria",
  "Brunch",
  "Food",
  "Burgers",
  "Pizza",
  "Tacos",
  "Trivia",
  "Karaoke",
  "Bowling",
  "Ping Pong",
  "Pool",
  "Games",
  "Stand Up",
  "Open Mic",
  "Live Music"
];
