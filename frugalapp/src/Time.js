import moment from "moment";

export function validateTime(str) {
  const date = moment(str, ["h:ma", "H:m"]);
  const validDate = date.isValid();
  const containsMeridian = str.indexOf("am") > -1 || str.indexOf("pm") > -1;
  return validDate && containsMeridian;
}

export function formatTime(time) {
  let hours = parseInt(time.substring(0, 2), 10);
  let meridian = "am";
  if (hours > 12) {
    hours = hours - 12;
    meridian = "pm";
  } else if (hours === 0) {
    hours = 12;
  }

  const minutes = time.substring(2);
  return `${hours}:${minutes}${meridian}`;
}

export function formatHours(times) {
  return times.map(formatTime).join(" - ");
}

function parsePeriod(period) {
  const close = parseInt(period.close.time, 10);
  const open = parseInt(period.open.time, 10);

  return { close, open };
}

export function openingPeriod(item, iso) {
  const time = parseInt(item.end, 10);
  const period = item.periods.find(period => {
    const { open, close } = parsePeriod(period);
    const afterOpen =
      (time > open && time < close && period.open.day === iso) ||
      (time < close && period.close.day === iso);
    return afterOpen;
  });
  return period;
}

export function closingPeriod(item, iso) {
  const time = parseInt(item.start, 10);
  const period = item.periods.find(period => {
    const { open, close } = parsePeriod(period);
    const beforeClose =
      (time > open && time < close && period.close.day === iso) ||
      (time > open && period.open.day === iso);
    return beforeClose;
  });
  return period;
}

export function makeHours(item, iso) {
  let hours;

  if (item.start && item.end) {
    hours = `${item.start} - ${item.end}`;
  } else if (item.start) {
    const period = closingPeriod(item, iso);
    hours = formatHours([item.start, period.close.time]);
  } else if (item.end) {
    const period = openingPeriod(item, iso);
    hours = formatHours([period.open.time, item.end]);
  } else {
    hours = `All Day`;
  }

  return hours;
}
