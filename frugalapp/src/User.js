import { Notifications, Permissions } from "expo";
import api from "./API";
import locate from "./Locate";

export async function sync() {
  try {
    const { status } = await Permissions.askAsync(
      Permissions.NOTIFICATIONS,
      Permissions.LOCATION
    );
    if (status !== "granted") {
      return;
    }

    const {
      coords: { latitude: lat, longitude: lng }
    } = await locate();

    const token = await Notifications.getExpoPushTokenAsync();

    api("sync-user", {
      token,
      location: [lng, lat]
    });
  } catch (error) {
    console.log(error);
  }
}
