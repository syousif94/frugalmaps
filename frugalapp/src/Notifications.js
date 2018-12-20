import { Linking, AsyncStorage, Alert } from "react-native";

import { Notifications, Permissions } from "expo";
import { makeDuration } from "./Time";

function create({ _source: item, _id: id }) {
  const hours = item.groupedHours[0];

  const days = hours.days.join(", ");

  const duration = makeDuration(item.groupedHours[0]);

  const title = `${item.title} · ${hours.hours} (${duration}hr)`;
  const body = `${item.location} (${days}) · ${item.description}`;

  return Notifications.scheduleLocalNotificationAsync(
    {
      title,
      body,
      data: { id }
    },
    { time: Date.now() + 3000, repeat: "week" }
  );
}

async function checkPermission() {
  const { status: askStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );

  if (askStatus === "denied") {
    Alert.alert(
      "Permission Denied",
      "To enable notifications, tap Open Settings and then toggle the Notifications switch.",
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

    return askStatus;
  }

  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  return status;
}

export async function toggleEvent(event) {
  try {
    const { _id: id } = event;

    const itemId = `${id}`;

    const existingNotificationId = await AsyncStorage.getItem(itemId);

    if (existingNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        existingNotificationId
      );
      await AsyncStorage.removeItem(itemId);
      return false;
    }

    const status = await checkPermission();

    if (status !== "granted") {
      return;
    }

    const notificationId = await create(event);

    await AsyncStorage.setItem(itemId, notificationId);
    return true;
  } catch (error) {
    Alert.alert("Error", error.message);
    return;
  }
}
