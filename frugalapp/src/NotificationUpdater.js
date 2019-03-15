import { AsyncStorage } from "react-native";
import _ from "lodash";
import api from "./API";
import { updateNotifications } from "./Notifications";

class NotificationUpdater {
  constructor() {
    this.updateKeys();
  }
  _getKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();

    const notificationIds = keys.filter(
      key =>
        key !== "postCode" && key !== "oldData" && !_.startsWith(key, "cal")
    );

    return notificationIds;
  };

  _getData = async ids => {
    const res = await api("fetch-events", { ids });
    return res.events;
  };

  updateKeys = async () => {
    try {
      const notificationIds = await this._getKeys();

      const events = await this._getData(notificationIds);

      updateNotifications(events);
    } catch (error) {
      console.log(error);
    }
  };
}

export default new NotificationUpdater();
