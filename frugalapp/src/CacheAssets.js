import { Asset, Font } from "expo";
import {
  Entypo,
  FontAwesome,
  MaterialIcons,
  Ionicons
} from "@expo/vector-icons";

const fonts = [Entypo, FontAwesome, MaterialIcons, Ionicons].map(
  font => font.font
);

const images = [
  require("../assets/pin.png"),
  require("../assets/intro.png"),
  require("../assets/sadCalendar.png"),
  require("../assets/sadCalendarLarge.png")
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

export async function loadAssetsAsync() {
  const imageAssets = cacheImages(images);

  const fontAssets = cacheFonts(fonts);

  await Promise.all([...imageAssets, ...fontAssets]);
}
