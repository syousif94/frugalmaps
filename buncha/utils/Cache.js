import { Asset } from "expo-asset";
import * as Font from "expo-font";
import {
  Entypo,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  EvilIcons,
  Feather
} from "@expo/vector-icons";
import User from "./User";

const fonts = [
  Entypo,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  EvilIcons,
  Feather
].map(font => font.font);

const images = [
  require("../assets/pin.png"),
  require("../assets/pin-now.png"),
  require("../assets/pin-upcoming.png"),
  require("../assets/pin-selected.png"),
  require("../assets/pin-now-selected.png"),
  require("../assets/pin-upcoming-selected.png"),
  require("../assets/intro.png")
];

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default async function cache() {
  const imageAssets = cacheImages(images);

  const fontAssets = cacheFonts(fonts);

  await Promise.all([...imageAssets, ...fontAssets, User.init()]);
}
