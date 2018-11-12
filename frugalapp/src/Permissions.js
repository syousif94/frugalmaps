import { Linking, Alert } from "react-native";

import { Permissions } from "expo";
import store from "./store";
import * as Location from "./store/location";
import { IOS } from "./Constants";

export async function grantLocation() {
  const { status: askStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );

  if (IOS && askStatus === "denied") {
    Alert.alert(
      "Permission Denied",
      "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openURL("app-settings:");
          }
        }
      ]
    );
    throw new Error("Permission Denied");
  } else if (askStatus === "granted") {
    store.dispatch(Location.actions.set({ authorized: true }));
    return;
  }

  const { status: locationStatus } = await Permissions.askAsync(
    Permissions.LOCATION
  );

  if (locationStatus !== "granted") {
    throw new Error("Permission Denied");
  }

  store.dispatch(Location.actions.set({ authorized: true }));
}
