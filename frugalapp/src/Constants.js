import { Dimensions } from "react-native";

export const DAYS = ["S", "M", "T", "W", "Th", "F", "Sa"];

export const DEV = process.env.NODE_ENV === "development";

export const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
