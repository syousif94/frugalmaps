import { Linking, AsyncStorage, Alert } from "react-native";

import { Notifications, Permissions } from "expo";
import { makeDuration, createDate, dayToISO, groupHours } from "./Time";
import { ABBREVIATED_DAYS } from "./Constants";
import _ from "lodash";
import api from "./API";
import store from "./store";
import * as Events from "./store/events";
import CalendarManager from "./CalendarManager";

function handleNotification(navigator) {
  return notification => {
    switch (notification.origin) {
      case "selected":
        const {
          events: {
            selectedEvent: { id }
          }
        } = store.getState();

        if (id === notification.data.id) {
          return;
        }
        store.dispatch(
          Events.actions.set({
            selectedId: notification.data.id
          })
        );
        navigator._navigation.navigate("Info");
        break;
      default:
        break;
    }
  };
}

export function watchNotifications(navigator) {
  Notifications.addListener(handleNotification(navigator));
}

export async function createNotification({ _source: item, _id: id }) {
  const hours = item.groupedHours[0];

  const duration = makeDuration(item.groupedHours[0]);

  const title = `${item.title} starts in 30 minutes!`;
  const body = `${item.location} · ${hours.hours} (${duration}hr)\n${
    item.description
  }`;

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
    await api("sync-reminder", {
      state,
      id,
      token
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateNotifications(events) {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

  if (status !== "granted") {
    return;
  }

  await Promise.all(
    events.map(async event => {
      const id = event._id;

      const existingNotificationId = await AsyncStorage.getItem(id);

      if (existingNotificationId) {
        const ids = JSON.parse(existingNotificationId);

        await Promise.all(
          ids.map(id => {
            return Notifications.cancelScheduledNotificationAsync(id);
          })
        );
      }

      if (!event.found) {
        AsyncStorage.removeItem(id);
        CalendarManager.toggleEvent(event, false);
        syncReminder(id, false);
        return;
      }

      event._source.groupedHours = groupHours(event._source);

      const notificationId = await createNotification(event);

      AsyncStorage.setItem(id, notificationId);
      // CalendarManager.toggleEvent(event, true);
    })
  );
}

export async function toggleEvent(event) {
  try {
    const { _id: id } = event;

    const existingNotificationId = await AsyncStorage.getItem(id);

    if (existingNotificationId) {
      const ids = JSON.parse(existingNotificationId);

      await Promise.all(
        ids.map(id => {
          return Notifications.cancelScheduledNotificationAsync(id);
        })
      );
      await AsyncStorage.removeItem(id);
      await CalendarManager.toggleEvent(event, false);
      syncReminder(id, false);
      return false;
    }

    const status = await checkPermission();

    if (status !== "granted") {
      return;
    }

    const notificationId = await createNotification(event);

    await AsyncStorage.setItem(id, notificationId);
    await CalendarManager.toggleEvent(event, true);
    syncReminder(id, true);
    return true;
  } catch (error) {
    Alert.alert("Error", error.message);
    return;
  }
}
