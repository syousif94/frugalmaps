import { WEB } from "./Constants";
import { Share } from "react-native";

let copy;
if (WEB) {
  copy = require("clipboard-copy");
}

export default async function share(event) {
  const url = `https://buncha.app/e/${event._id}`;
  const message = `Check out ${event._source.title} at ${
    event._source.location
  } on Buncha!`;
  const title = event._source.title;
  try {
    if (WEB) {
      if (window.navigator.share) {
        await window.navigator.share({
          title,
          text: message,
          url
        });
      } else {
        await copy(`${message} ${url}`);
      }
    } else {
      await Share.share({
        title,
        message,
        url
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}
