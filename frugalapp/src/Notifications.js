import { Linking, AsyncStorage, Alert } from "react-native";

import { Notifications, Permissions } from "expo";
import { makeDuration, createDate, dayToISO } from "./Time";
import { ABBREVIATED_DAYS } from "./Constants";
import _ from "lodash";
import api from "./API";

async function createNotification({ _source: item, _id: id }) {
  const hours = item.groupedHours[0];

  const duration = makeDuration(item.groupedHours[0]);

  const title = `${item.title} starts in 30 minutes!`;
  const body = `${item.location} · ${hours.hours} (${duration}hr)`;

  const timesToNotify = _(item.groupedHours)
    .map(group => {
      const isoDays = group.days.map(day => {
        const start = group.start;
        const iso = dayToISO(ABBREVIATED_DAYS.indexOf(day.text));
        const date = createDate(start, iso);
        return date.subtract(30, "m");
      });

      return isoDays;
    })
    .flatten()
    .value();

  const notifications = await Promise.all(
    timesToNotify.map(time => {
      console.log(time.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      return Notifications.scheduleLocalNotificationAsync(
        {
          title,
          body,
          data: { id }
        },
        { time: time.valueOf(), repeat: "week" }
      );
    })
  );

  return JSON.stringify(notifications);
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

async function syncReminder(id, state) {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    api("sync-reminder", {
      state,
      id,
      token
    });
  } catch (error) {
    console.log(error);
  }
}

export async function toggleEvent(event) {
  try {
    const { _id: id } = event;

    const itemId = `${id}`;

    const existingNotificationId = await AsyncStorage.getItem(itemId);

    if (existingNotificationId) {
      const ids = JSON.parse(existingNotificationId);

      await Promise.all(
        ids.map(id => {
          return Notifications.cancelScheduledNotificationAsync(id);
        })
      );
      await AsyncStorage.removeItem(itemId);
      syncReminder(id, false);
      return false;
    }

    const status = await checkPermission();

    if (status !== "granted") {
      return;
    }

    const notificationId = await createNotification(event);

    await AsyncStorage.setItem(itemId, notificationId);
    syncReminder(id, true);
    return true;
  } catch (error) {
    Alert.alert("Error", error.message);
    return;
  }
}
