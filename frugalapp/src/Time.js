import moment from "moment";
import { ISO_DAYS, DAYS } from "./Constants";

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

export function createDate(time, iso, start) {
  let date = moment(time, ["h:ma", "H:m"]).isoWeekday(iso);
  const now = moment();

  const startInt = start && parseInt(start, 10);
  const endInt = start && parseInt(time, 10);

  if (startInt && startInt > endInt) {
    date.add(1, "d");
  }
  if (date.isBefore(now)) {
    date = date.add(7, "d");
  }
  return date;
}

export function timeRemaining(hours, iso, currentTime) {
  const time = currentTime || Date.now();
  let ending = false;
  let now = moment();
  let diff;
  let remaining = null;
  const start = createDate(hours.start, iso);
  const end = createDate(hours.end, iso, hours.start);
  if (now.isBefore(end) && end.isBefore(start)) {
    ending = true;
    diff = end.valueOf() - time;
  } else if (now.isBefore(start)) {
    diff = start.valueOf() - time;
  }
  if (diff) {
    let hourFloat = diff / 3600000;

    const days = Math.floor(hourFloat / 24);

    hourFloat = hourFloat - days * 24;

    const hour = Math.floor(hourFloat);

    const minFloat = (hourFloat - hour) * 60;

    const minutes = Math.floor(minFloat);

    const seconds = Math.floor((minFloat - minutes) * 60);

    remaining = "";

    if (days > 0) {
      remaining += `${days}d `;
    }

    if (hour > 0) {
      remaining += `${hour}h `;
    }

    if (minutes > 0) {
      remaining += `${minutes}m `;
    }

    remaining += `${seconds}s`;

    remaining = remaining.trim();
  }

  return { remaining, ending };
}

export function makeHours(item, iso) {
  let hours;
  let start;
  let end;

  let day = iso !== undefined ? iso : ISO_DAYS[item.days[0]];

  if (item.start && item.end) {
    hours = formatHours([item.start, item.end]);
    start = item.start;
    end = item.end;
  } else if (item.start) {
    const period = closingPeriod(item, day);
    hours = formatHours([item.start, period.close.time]);
    start = item.start;
    end = period.close.time;
  } else if (item.end) {
    const period = openingPeriod(item, day);
    hours = formatHours([period.open.time, item.end]);
    start = period.open.time;
    end = item.end;
  } else {
    const period = item.periods.find(period => {
      return period.open.day === iso;
    });
    hours = formatHours([period.open.time, period.close.time]);
    start = period.open.time;
    end = period.close.time;
  }

  return { hours, start, end };
}

export function groupHours(source) {
  return source.days.reduce((acc, day) => {
    const text = DAYS[day];
    const iso = ISO_DAYS[day];
    const { hours, start, end } = makeHours(source, iso);

    const matchingHours = acc.find(val => val.hours === hours);

    if (matchingHours) {
      matchingHours.days.push(text);
    } else {
      acc.push({
        days: [text],
        hours,
        start,
        end
      });
    }

    return acc;
  }, []);
}
