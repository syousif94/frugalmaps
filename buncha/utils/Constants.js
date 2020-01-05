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

export const ISO_ABBREVIATED_DAYS = [
  ABBREVIATED_DAYS[6],
  ...ABBREVIATED_DAYS.slice(0, -1)
];

export const LONG_DAYS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
};

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

export const ANDROID_WEB = WEB && /Android/.test(navigator.userAgent);
export const IOS_WEB =
  WEB &&
  ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
export const MOBILE_WEB = ANDROID_WEB || IOS_WEB;

const portraitNarrow = WIDTH < HEIGHT && WIDTH <= 500;
const landscapeNarrow = HEIGHT < WIDTH && HEIGHT <= 500;

export const NARROW = portraitNarrow || landscapeNarrow;

export const PLACEMENT_ID = IOS
  ? "1931177036970533_1956753154412921"
  : "1931177036970533_1991298450958391";

export const EVENT_TYPES = [
  "Food",
  "Happy Hour",
  "Club",
  "Brunch",
  "Karaoke",
  "Trivia",
  "Tacos",
  "Pizza",
  "Margs",
  "Mimosas",
  "Burgers",
  "Bingo",
  "Bowling",
  "Ping Pong",
  "Pool",
  "Board Games",
  "Comedy",
  "Open Mic",
  "Sports",
  "Live Music",
  "Sangria",
  "Beer",
  "Wine",
  "Wells",
  "Shots"
];
