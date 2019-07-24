import moment from "moment";
import { ISO_DAYS, ABBREVIATED_DAYS as DAYS } from "./Constants";

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
      (time > open && period.open.day === iso) ||
      (period.open.day === iso && period.close.day !== period.open.day);
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
    if (date.isBefore(now)) {
      date = date.add(7, "d");
    }
  }

  return date;
}

export function dayToISO(day) {
  return ISO_DAYS[day];
}

export function makeISO(days) {
  const today = moment().weekday();

  const closestDay = days.sort((_a, _b) => {
    let a = dayToISO(_a) - today;
    if (a < 0) {
      a += 7;
    }
    let b = dayToISO(_b) - today;
    if (b < 0) {
      b += 7;
    }
    return a - b;
  })[0];

  return dayToISO(closestDay);
}

export function makeYesterdayISO(days) {
  let today = moment().weekday();

  if (today === 0) {
    today = 7;
  }

  const yesterdayISO = days.find(day => dayToISO(day) - today === -1);

  return dayToISO(yesterdayISO);
}

export function makeDuration(hours) {
  const start = moment(hours.start, ["h:ma", "H:m"]);
  let end = moment(hours.end, ["h:ma", "H:m"]);

  const startInt = parseInt(hours.start, 10);
  const endInt = parseInt(hours.end, 10);

  if (startInt > endInt) {
    end = end.add(1, "d");
  }

  return end.diff(start, "hours");
}

function pluralize(count) {
  return count === 1 ? "" : "s";
}

export function timeRemaining(hours, iso) {
  const time = Date.now();
  let ending = false;
  let now = moment();
  let diff;
  let remaining = null;
  let tomorrow = null;
  const start = createDate(hours.start, iso);
  const end = createDate(hours.end, iso, hours.start);
  if (now.isBefore(end) && end.isBefore(start)) {
    ending = true;
    diff = end.valueOf() - time;
  } else if (now.isBefore(start)) {
    diff = start.valueOf() - time;
    if (hours.today && hours.days.length > 1) {
      const nextDay = hours.days.find(day => day.daysAway > 0);
      const nextStart = start.clone().subtract(7 - nextDay.daysAway, "d");
      const nextDiff = nextStart.valueOf() - time;
      if (nextDiff >= 0) {
        tomorrow = nextDay;
        diff = Math.min(nextDiff, diff);
      }
    }
  } else if (hours.today) {
    let daysAway = 7;
    if (hours.days.length > 1) {
      const nextDay = hours.days.find(day => day.daysAway > 0);
      daysAway = nextDay.daysAway;
    }
    const nextStart = start.clone().add(daysAway, "d");
    const nextDiff = nextStart.valueOf() - time;
    if (nextDiff >= 0) {
      diff = nextDiff;
    }
  }
  if (diff) {
    let hourFloat = diff / 3600000;

    // const days = Math.floor(hourFloat / 24);

    // hourFloat = hourFloat - days * 24;

    const hour = Math.floor(hourFloat);

    const minFloat = (hourFloat - hour) * 60;

    const minutes = Math.floor(minFloat);

    remaining = "";

    if (hour > 0) {
      remaining = { value: hour, unit: `hour${pluralize(hour)}` };
    } else {
      remaining = { unit: `minute${pluralize(minutes)}`, value: minutes };
    }
  }

  const ended =
    !ending &&
    hours.today &&
    end.isAfter(start) &&
    start.isAfter(now.endOf("day"));

  return { remaining, ending, ended, tomorrow };
}

export function makeHours(item, iso) {
  // good place to include documentation
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
  const todayIso = moment().weekday();
  const groups = source.days
    .sort((_a, _b) => {
      let a = dayToISO(_a) - todayIso;
      if (a < 0) {
        a += 7;
      }
      let b = dayToISO(_b) - todayIso;
      if (b < 0) {
        b += 7;
      }
      return a - b;
    })
    .reduce((acc, day) => {
      const iso = ISO_DAYS[day];
      const today = iso === todayIso;
      let daysAway = iso - todayIso;
      if (daysAway < 0) {
        daysAway += 7;
      }
      const dayInfo = {
        text: DAYS[day],
        iso,
        daysAway
      };

      const { hours, start, end } = makeHours(source, iso);

      // another good place for documentation

      const matchingHours = acc.find(val => val.hours === hours);

      if (matchingHours) {
        matchingHours.days.push(dayInfo);
      } else {
        acc.push({
          iso,
          today,
          days: [dayInfo],
          hours,
          start,
          end,
          duration: makeDuration({ start, end })
        });
      }

      return acc;
    }, []);

  return groups;
}

export function itemRemaining(item) {
  const iso = makeISO(item._source.days);
  const yesterdayIso = makeYesterdayISO(item._source.days);
  let remaining;
  let ending;
  let ended;

  let spanHours = item._source.groupedHours.find(group =>
    group.days.find(day => day.iso === iso)
  );

  const { remaining: r, ending: e, ended: ed, tomorrow } = timeRemaining(
    spanHours,
    iso
  );

  remaining = r;
  ending = e;
  ended = ed;

  if (yesterdayIso !== undefined && !ending && !tomorrow) {
    const hours = item._source.groupedHours.find(group =>
      group.days.find(day => day.iso === yesterdayIso)
    );
    if (hours) {
      const { remaining: r, ending: e } = timeRemaining(hours, yesterdayIso);

      if (e) {
        spanHours = hours;
        remaining = r;
        ending = e;
      }
    }
  }

  if (!ending && (!spanHours.today || tomorrow || ended)) {
    let away = tomorrow ? tomorrow.daysAway : spanHours.days[0].daysAway;
    if (!away) {
      away = 7;
    }
    remaining = { unit: `day${pluralize(away)}`, value: away };
  }

  let text = `${remaining.value} ${remaining.unit}`;
  let color = "#E3210B";

  if (ending) {
    color = "#18AB2E";
    text = `ends in ${text}`;
  } else {
    text = `in ${text}`;
    const happening = !ended && !ending && spanHours.today;
    if (happening) {
      color = "#E9730C";
    }
  }

  const day = (tomorrow && tomorrow.text) || spanHours.days[0].text;

  const span = itemTime(day, spanHours);

  return { text, color, span, remaining };
}

export function itemTime(day, groupedHours) {
  const span = groupedHours.hours
    .split(" ")
    .filter(str => str.length > 5)
    .map(str => {
      let [hour, minutesAndMeridian] = str.split(":");
      const minutes = minutesAndMeridian.substring(0, 2);
      if (minutes !== "00") {
        hour = `${hour}:${minutesAndMeridian}`;
      } else {
        const meridian = minutesAndMeridian.substring(2);
        hour = `${hour}${meridian}`;
      }
      return hour;
    })
    .join(" to ");

  return `${day} ${span}`;
}
