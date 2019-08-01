import React from "react";
import { toggle } from "../store/submission";
import DayPicker from "./DayPicker";

const toggleDays = toggle("days");

export default () => {
  return (
    <DayPicker toggle={toggleDays} selector={state => state.submission.days} />
  );
};
