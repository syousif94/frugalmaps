import moment from "moment";
import { ISO_DAYS, ABBREVIATED_DAYS as DAYS, LONG_DAYS } from "./Constants";
import { NOW, UPCOMING, NOT_TODAY } from "./Colors";
import _ from "lodash";

function isValidVal(i, str) {
  if (!i) {
    const val = parseInt(str, 10);
    return val <= 12 && val > 0;
  } else if (i === 2) {
    const val = parseInt(str, 10);
    return val <= 59 && val >= 0;
  }
  return true;
}

export function validateTime(str) {
  const validLength = str
    .split(/(:|am|pm)/gi)
    .filter(val => val.trim().length)
    .reduce((prev, cur, i) => {
      return prev && i < 4 && cur.length < 3 && isValidVal(i, cur);
    }, true);
  const validTime = str.match(/(\d{1,2}):(\d{2})/g);
  const containsMeridian = str.indexOf("am") > -1 || str.indexOf("pm") > -1;
  return validLength && validTime && containsMeridian;
}

const splitStringAt = index => x => [x.slice(0, index), x.slice(index)];

export function detruncateTime(val) {
  const aIndex = val.indexOf("a");
  const pIndex = val.indexOf("p");

  const hasA = aIndex > -1;
  const hasP = pIndex > -1;
  const hasAorP = hasA || hasP;
  const hasMinutes = val.match(/:(\d{2})/g);
  const hasM = val.indexOf("m") > -1;

  if (hasMinutes && hasAorP && hasM) {
    return val;
  }

  let str = val;

  if (!hasMinutes) {
    if (hasA) {
      const [time, meridian] = splitStringAt(aIndex)(str);
      str = `${time}:00${meridian}`;
    } else if (hasP) {
      const [time, meridian] = splitStringAt(pIndex)(str);
      str = `${time}:00${meridian}`;
    } else {
      str = `${str}:00`;
    }
  }

  if (!hasM && hasAorP) {
    str = `${str}m`;
  } else if (!hasAorP) {
    str = `${str}pm`;
  }

  return str;
}

export function formatTime(time) {
  let hours = parseInt(time.substring(0, 2), 10);
  const meridian = hours > 11 ? "pm" : "am";
  if (hours > 12) {
    hours = hours - 12;
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

export function makeISO(days, searchTime) {
  const today = moment(searchTime).weekday();

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

export function makeYesterdayISO(days, searchTime) {
  let today = moment(searchTime).weekday();

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

    const minutes = Math.ceil(minFloat);

    remaining = "";

    if (hour) {
      remaining += `${hour}h`;
    }

    if ((!hour || ending) && minutes) {
      remaining += `${hour ? " " : ""}${minutes}m`;
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

function allDaysConsecutive(sortedDays) {
  let i = 1;

  while (i < sortedDays.length) {
    const prevDay = sortedDays[i - 1];
    const day = sortedDays[i];

    const daysApart = day.iso - prevDay.iso;
    if (daysApart !== 1) {
      return false;
    }
    i += 1;
  }

  return true;
}

export function itemSpans(item) {
  const hours = item._source.groupedHours;
  const spans = hours.map(hours => {
    const hoursText = hours.hours;

    if (hours.days.length === 1) {
      return {
        days: hours.days[0].text,
        hours: hoursText
      };
    } else if (hours.days.length === 7) {
      return {
        days: "Everyday",
        hours: hoursText
      };
    }

    let sortedDays = hours.days.sort((a, b) => a.iso - b.iso);

    if (!sortedDays[0].iso) {
      sortedDays = [...sortedDays.slice(1), { ...sortedDays[0], iso: 7 }];
    }

    if (sortedDays.length === 2) {
      return {
        days: sortedDays.map(day => day.text).join(" & "),
        hours: hoursText
      };
    }

    if (allDaysConsecutive(sortedDays)) {
      return {
        days: `${sortedDays[0].text} - ${
          sortedDays[sortedDays.length - 1].text
        }`,
        hours: hoursText
      };
    }

    return {
      days: sortedDays.map(day => day.text).join(", "),
      hours: hoursText
    };
  });

  return spans;
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

  let { remaining: r, ending: e, ended: ed, tomorrow } = timeRemaining(
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

  tomorrow = tomorrow || spanHours.days[0].daysAway === 1;

  if (tomorrow) {
    tomorrow = parseInt(remaining.replace("h", ""), 10) < 24;
  }

  if (!ending && !tomorrow && (!spanHours.today || ended)) {
    let away = spanHours.days[0].daysAway;
    if (!away) {
      away = 7;
    }
    remaining = `${away}d`;
  }

  const upcoming =
    (!ended && !ending && spanHours.today) || (tomorrow && !ending);

  let color = NOT_TODAY;

  if (ending) {
    color = NOW;
  } else {
    if (upcoming) {
      color = UPCOMING;
    }
  }

  const day = (tomorrow && tomorrow.text) || spanHours.days[0].text;

  const { span, start, end } = itemTime(day, spanHours, ending, upcoming);

  let text;

  if (ending) {
    text = `til ${end}`;
  } else if (upcoming) {
    text = `${start} today`;
  } else {
    text = `${start} ${LONG_DAYS[day]}`;
  }

  const duration = ending ? `${remaining} left` : `${remaining} away`;

  return {
    text,
    color,
    span,
    remaining,
    ending,
    upcoming,
    day,
    start,
    duration,
    tomorrow,
    end
  };
}

export function itemTimeForDay(item, day) {
  const hours = item._source.groupedHours.find(hours =>
    hours.days.find(d => d.iso === day.iso)
  );
  const [start] = truncatedHours(hours);
  return {
    text: `${start} ${day.title}`,
    color: UPCOMING,
    duration: ` ${hours.duration}hr${pluralize(hours.duration)}`
  };
}

export function itemRemainingAtTime(item, time) {
  const day = makeISO(item._source.days, time);

  const yesterday = makeYesterdayISO(item._source.days, time);

  let hours = item._source.groupedHours.find(hours =>
    hours.days.find(d => d.iso === day)
  );

  const now = moment(time);

  const nextOccurring = now.clone().isoWeekday(day);

  if (nextOccurring.isBefore(now)) {
    nextOccurring.add(7, "d");
  }

  const dateFormat = "M D Y";
  const parseFormat = `${dateFormat} HHmm`;
  const nowDate = nextOccurring.format(dateFormat);

  let start = moment(`${nowDate} ${hours.start}`, parseFormat);

  let end = moment(`${nowDate} ${hours.end}`, parseFormat);

  if (end.isBefore(start)) {
    end.add(1, "d");
  }

  let ending = start.isSameOrBefore(now) && end.isSameOrAfter(now);

  if (!ending && yesterday !== undefined) {
    const yesterdayHours = item._source.groupedHours.find(hours =>
      hours.days.find(d => d.iso === yesterday)
    );

    const yesterdayNow = now.clone().subtract(1, "d");
    const yesterdayDateStr = yesterdayNow.format(dateFormat);
    const yesterdayStart = moment(
      `${yesterdayDateStr} ${yesterdayHours.start}`,
      parseFormat
    );
    const yesterdayEnd = moment(
      `${yesterdayDateStr} ${yesterdayHours.end}`,
      parseFormat
    );
    if (yesterdayEnd.isBefore(yesterdayStart)) {
      yesterdayEnd.add(1, "d");
    }

    if (yesterdayEnd.isSameOrAfter(now)) {
      ending = true;
      hours = yesterdayHours;
      end = yesterdayEnd;
    }
  }

  if (!ending && end.isSameOrBefore(now)) {
    const nextDay = _.flatten(
      item._source.groupedHours.map(group => group.days)
    )
      .sort((a, b) => {
        return a.daysAway - b.daysAway;
      })
      .find(day => day.daysAway > 0);
    if (nextDay) {
      hours = item._source.groupedHours.find(hours =>
        hours.days.find(d => d.iso === nextDay.iso)
      );
      const nextOccurring = now.clone().isoWeekday(nextDay.iso);

      if (nextOccurring.isBefore(now)) {
        nextOccurring.add(7, "d");
      }

      const nowDate = nextOccurring.format(dateFormat);

      start = moment(`${nowDate} ${hours.start}`, parseFormat);

      end = moment(`${nowDate} ${hours.end}`, parseFormat);
    }
  }

  let upcoming = start.isAfter(now) && start.weekday() === now.weekday();

  const [startStr, endStr] = truncatedHours(hours);

  let text = "";
  let color = NOT_TODAY;
  let duration = "";

  if (ending) {
    color = NOW;
    text = `til ${endStr} ${end.format("dddd")}`;
  } else if (upcoming) {
    color = UPCOMING;
    text = `${startStr} ${start.format("dddd")}`;
  } else {
    text = `${startStr} ${start.format("dddd")}`;
  }

  const payload = {
    text,
    color,
    duration
  };

  return payload;
}

function truncateHour(str) {
  let [hour, minutesAndMeridian] = str.split(":");
  const minutes = minutesAndMeridian.substring(0, 2);
  if (minutes !== "00") {
    hour = `${hour}:${minutesAndMeridian}`;
  } else {
    const meridian = minutesAndMeridian.substring(2);
    hour = `${hour}${meridian}`;
  }
  return hour;
}

export function truncatedHours(groupedHours) {
  return groupedHours.hours
    .split(" ")
    .filter(str => str.length > 5)
    .map(truncateHour);
}

export function itemTime(day, groupedHours, ending, upcoming) {
  const [start, end] = truncatedHours(groupedHours);

  let span;
  if (ending || upcoming) {
    span = `Today ${start} to ${end}`;
  } else {
    span = `${day} ${start} to ${end}`;
  }

  return { span, start, end };
}
