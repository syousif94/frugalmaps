import { Linking, Alert } from "react-native";

import { Permissions } from "expo";

async function locationPrompt(next) {
  const { status: askStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );

  if (askStatus === "denied") {
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
  }

  const { status: locationStatus } = await Permissions.askAsync(
    Permissions.LOCATION
  );

  if (locationStatus !== "granted") {
    return;
  }

  if (next) {
    next();
  }
}
