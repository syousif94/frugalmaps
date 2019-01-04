import { Alert } from "react-native";
import store from "./store";
import { validateTime } from "./Time";

function invalid(title, message) {
  Alert.alert(title, message);

  return false;
}

export function validSubmission() {
  const {
    submission: {
      eventType,
      title,
      description,
      startTime,
      endTime,
      place,
      days
    }
  } = store.getState();

  if (!place) {
    return invalid(
      "Missing Restaurant",
      "Please select a restaurant to proceed"
    );
  }

  if (!title.length) {
    return invalid("Missing Title", "Please name the event to proceed");
  }

  if (!description.length) {
    return invalid(
      "Missing Description",
      "Please add a short description to proceed"
    );
  }

  if (!days.length) {
    return invalid(
      "Missing Days",
      "Please select the days of the event to proceed"
    );
  }

  if (!eventType) {
    return invalid(
      "Missing Type",
      "Please select the event the event to proceed"
    );
  }

  if (startTime && startTime.length && !validateTime(startTime)) {
    return invalid("Invalid Start Time", "Make sure the formatting is correct");
  }

  if (endTime && endTime.length && !validateTime(endTime)) {
    return invalid("Invalid End Time", "Make sure the formatting is correct");
  }

  return true;
}
