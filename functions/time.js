const moment = require("moment");
const _ = require("lodash");

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ISO_DAYS = [1, 2, 3, 4, 5, 6, 0];

function formatTo2400(str) {
  const date = moment(str, ["h:ma", "H:m"]);
  const isValid = date.isValid();
  if (isValid) {
    const str = date.format("HHmm");
    return str;
  } else {
    throw new Error("Invalid Time");
  }
}

function formatTime(time) {
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

function formatHours(times) {
  return times.map(formatTime).join(" - ");
}

function parsePeriod(period) {
  const close = parseInt(period.close.time, 10);
  const open = parseInt(period.open.time, 10);

  return { close, open };
}

function openingPeriod(item, iso) {
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

function closingPeriod(item, iso) {
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

function createDate(now, time, iso, start) {
  const hours = parseInt(time.substring(0, 2), 10);
  const minutes = parseInt(time.substring(2), 10);
  let date = now
    .clone()
    .utcOffset(now.utcOffset())
    .hour(hours)
    .minute(minutes)
    .isoWeekday(iso);

  const startInt = start && parseInt(start, 10);
  const endInt = start && parseInt(time, 10);

  if (startInt && startInt > endInt) {
    date.add(1, "d");
  }

  if (date.isSameOrBefore(now, "minute")) {
    date = date.add(7, "d");
    if (date.isSameOrBefore(now, "minute")) {
      date = date.add(7, "d");
    }
  }

  return date;
}

function dayToISO(day) {
  return ISO_DAYS[day];
}

function makeISO(days, now) {
  const today = now.weekday();

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

function makeYesterdayISO(days, now) {
  let today = now.weekday();

  if (today === 0) {
    today = 7;
  }

  const yesterdayISO = days.find(day => dayToISO(day) - today === -1);

  return dayToISO(yesterdayISO);
}

function makeDuration(hours) {
  const start = moment(hours.start, ["h:ma", "H:m"]);
  let end = moment(hours.end, ["h:ma", "H:m"]);

  const startInt = parseInt(hours.start, 10);
  const endInt = parseInt(hours.end, 10);

  if (startInt > endInt) {
    end = end.add(1, "d");
  }

  return end.diff(start, "hours");
}

function timeRemaining(hours, iso, today) {
  let ending = false;
  const now = today.clone().utcOffset(today.utcOffset());

  const time = now.valueOf();
  let diff;
  let remaining = null;
  const start = createDate(now, hours.start, iso);
  const end = createDate(now, hours.end, iso, hours.start);
  if (now.isBefore(end, "minute") && end.isBefore(start, "minute")) {
    ending = true;
    diff = end.valueOf() - time;
  } else if (now.isBefore(start, "minute")) {
    diff = start.valueOf() - time;
    if (hours.today && hours.days.length > 1) {
      const nextDay = hours.days.find(day => day.daysAway > 0);
      const nextStart = start.clone().subtract(7 - nextDay.daysAway, "d");
      const nextDiff = nextStart.valueOf() - time;
      if (nextDiff >= 0) {
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

    const days = Math.floor(hourFloat / 24);

    hourFloat = hourFloat - days * 24;

    const hour = Math.floor(hourFloat);

    const minFloat = (hourFloat - hour) * 60;

    const minutes = Math.floor(minFloat);

    const seconds = Math.floor((minFloat - minutes) * 60);

    remaining = "";

    if (days > 0) {
      remaining += `${days}:`;
    }

    if (hour > 0 || days > 0) {
      if (hour < 10 && days > 0) {
        remaining += `0${hour}:`;
      } else {
        remaining += `${hour}:`;
      }
    }

    if (minutes < 10) {
      remaining += `0${minutes}:`;
    } else {
      remaining += `${minutes}:`;
    }

    if (seconds < 10) {
      remaining += `0${seconds}`;
    } else {
      remaining += `${seconds}`;
    }

    remaining = remaining.trim();
  }

  const ended =
    !ending &&
    hours.today &&
    end.isAfter(start, "minute") &&
    start.isAfter(now.endOf("day"), "minute");

  return { remaining, ending, ended, diff };
}

// day is the non standard day int converted to iso day int
// iso is preconverted
function makeHours({ item, iso, day: rawDay }) {
  // good place to include documentation
  let hours;
  let start;
  let end;

  let day =
    iso !== undefined
      ? iso
      : rawDay !== undefined
      ? rawDay
      : ISO_DAYS[item.days[0]];

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

function groupHours(source, time) {
  const todayIso = time.weekday();
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

      const { hours, start, end } = makeHours({ item: source, iso });

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

const sortDays = (now, away) => (a, b) => {
  let aStart = parseInt(a._source.groupedHours[0].start, 10);
  let aEnd = parseInt(a._source.groupedHours[0].end, 10);

  if (aEnd < aStart) {
    aEnd += 2400;
  }

  // if (!away && aEnd < now) {
  //   aStart += 2400;
  //   aEnd += 2400;
  // }

  let bStart = parseInt(b._source.groupedHours[0].start, 10);
  let bEnd = parseInt(b._source.groupedHours[0].end, 10);

  if (bEnd < bStart) {
    bEnd += 2400;
  }

  // if (!away && bEnd < now) {
  //   bStart += 2400;
  //   bEnd += 2400;
  // }

  let diff;

  // const bothNow =
  //   !away && (aStart <= now && aEnd > now && bStart <= now && bEnd > now);

  const sameStart = aStart === bStart;

  if (/** bothNow ||  **/ sameStart) {
    diff = aEnd - bEnd;
  } else {
    diff = aStart - bStart;
  }

  return diff;
};

function makeEvents(now, hits) {
  const initial = [
    { title: "Monday", data: [], iso: 1, away: 0 },
    { title: "Tuesday", data: [], iso: 2, away: 0 },
    { title: "Wednesday", data: [], iso: 3, away: 0 },
    { title: "Thursday", data: [], iso: 4, away: 0 },
    { title: "Friday", data: [], iso: 5, away: 0 },
    { title: "Saturday", data: [], iso: 6, away: 0 },
    { title: "Sunday", data: [], iso: 0, away: 0 }
  ];

  if (!hits) {
    return initial;
  }

  hits.forEach(hit => {
    hit._source.days.forEach(day => {
      initial[day].data.push(hit);
    });
  });

  const today = now.weekday();

  const todayIndex = initial.findIndex(day => day.iso === today);

  const timeInt = parseInt(now.format("HHmm"), 10);

  const todayAndAfter = initial.slice(todayIndex, 7);

  const beforeToday = initial.slice(0, todayIndex);

  const days = [...todayAndAfter, ...beforeToday]
    .map((day, index) => {
      day.away = index;
      day.data = day.data.sort(sortDays(timeInt, index));
      return Object.assign(day, { index });
    })
    .filter(day => day.data.length);

  return days;
}

function makeMarkers(today, days) {
  const todayIso = today.weekday();
  const todayHours = parseInt(today.format("HHmm"), 10);
  return _(days)
    .map(day => {
      const clone = _.cloneDeep(day);
      clone.data = _(day.data)
        .groupBy(hit => hit._source.placeid)
        .map(events => {
          let firstEvent;

          const endingEvents = events.filter(event => {
            const iso = makeISO(event._source.days, today);
            const hours = event._source.groupedHours.find(group =>
              group.days.find(day => day.iso === iso)
            );
            const { ending } = timeRemaining(hours, iso, today);
            if (ending || event._source.groupedHours.length === 1) {
              return ending;
            }
            const yesterdayISO = makeYesterdayISO(event._source.days, today);
            const yHours = event._source.groupedHours.find(group =>
              group.days.find(day => day.iso === yesterdayISO)
            );
            if (yHours) {
              const { ending: endingYesterday } = timeRemaining(
                yHours,
                yesterdayISO,
                today
              );
              return endingYesterday;
            }
            return false;
          });

          if (endingEvents.length) {
            firstEvent = endingEvents[0];
          }

          const sortedEvents = events.sort((_a, _b) => {
            let a = _a._source.groupedHours[0].iso - todayIso;
            if (a < 0) {
              a += 7;
            }
            let b = _b._source.groupedHours[0].iso - todayIso;
            if (b < 0) {
              b += 7;
            }
            if (a !== b) {
              return a - b;
            }

            const bothToday = _a._source.groupedHours[0].iso === todayIso;

            let aStart = parseInt(_a._source.groupedHours[0].start, 10);
            let aEnd = parseInt(_a._source.groupedHours[0].end, 10);

            if (aEnd < aStart) {
              aEnd += 2400;
            }

            if (bothToday && aEnd < todayHours) {
              aStart += 2400;
              aEnd += 2400;
            }

            let bStart = parseInt(_b._source.groupedHours[0].start, 10);
            let bEnd = parseInt(_b._source.groupedHours[0].end, 10);

            if (bEnd < bStart) {
              bEnd += 2400;
            }

            if (bothToday && bEnd < todayHours) {
              bStart += 2400;
              bEnd += 2400;
            }

            return aStart - bStart;
          });

          if (!firstEvent) {
            firstEvent = sortedEvents[0];
          }

          return {
            _id: events[0]._id,
            type: "group",
            _source: firstEvent._source,
            events: sortedEvents
          };
        })
        .value();
      return clone;
    })
    .value();
}

function makeListData(calendar, time) {
  const yesterdayCal = calendar[calendar.length - 1];
  const yesterdayISO = calendar[calendar.length - 1].iso;

  const yesterdayEvents = yesterdayCal.data
    .reduce((prev, event) => {
      const iso = yesterdayISO;
      const hours = event._source.groupedHours.find(group =>
        group.days.find(day => day.iso === iso)
      );
      const { ending } = timeRemaining(hours, iso, time);
      if (ending) {
        prev.push({
          hours,
          event
        });
      }
      return prev;
    }, [])
    .sort((a, b) => {
      const aStart = parseInt(a.hours.start, 10);
      let aEnd = parseInt(a.hours.end, 10);
      if (aStart > aEnd) {
        aEnd += 2400;
      }
      const bStart = parseInt(b.hours.start, 10);
      let bEnd = parseInt(b.hours.end, 10);
      if (bStart > bEnd) {
        bEnd += 2400;
      }
      return aEnd - bEnd;
    })
    .map(data => data.event);

  const allUpcomingEvents = calendar[0].data.reduce(
    (prev, event) => {
      const hours = event._source.groupedHours.find(group =>
        group.days.find(day => day.iso === calendar[0].iso)
      );
      const { ended, ending } = timeRemaining(hours, calendar[0].iso, time);
      if (ending) {
        prev[0].push({
          event,
          hours
        });
      } else if (!ended) {
        prev[1].push(event);
      }
      return prev;
    },
    [[], []]
  );

  const endingUpcomingEvents = allUpcomingEvents[0]
    .sort((a, b) => {
      const aStart = parseInt(a.hours.start, 10);
      let aEnd = parseInt(a.hours.end, 10);
      if (aStart > aEnd) {
        aEnd += 2400;
      }
      const bStart = parseInt(b.hours.start, 10);
      let bEnd = parseInt(b.hours.end, 10);
      if (bStart > bEnd) {
        bEnd += 2400;
      }
      return aEnd - bEnd;
    })
    .map(data => data.event);

  const upcomingEvents = allUpcomingEvents[1];

  const taggedEvents = new Set();

  const endingTags = [...yesterdayEvents, ...endingUpcomingEvents].reduce(
    (tags, event) => {
      taggedEvents.add(event._id);
      event._source.tags.forEach(tag => {
        const tagList = tags[tag];
        if (!tagList) {
          tags[tag] = [];
        }
        tags[tag].push(event._id);
      });

      return tags;
    },
    {}
  );

  const upcomingTags = upcomingEvents.reduce((tags, event) => {
    taggedEvents.add(event._id);
    event._source.tags.forEach(tag => {
      const tagList = tags[tag];
      if (!tagList) {
        tags[tag] = [];
      }
      tags[tag].push(event._id);
    });
    return tags;
  }, {});

  const remainingEvents = [
    ...(calendar.length > 1 ? calendar.slice(1) : calendar).reduce(
      (events, day) => {
        let data = day.data;
        if (calendar.length < 2) {
          data = data.filter(event => {
            const hours = event._source.groupedHours.find(group =>
              group.days.find(groupDay => groupDay.iso === day.iso)
            );
            const { ended } = timeRemaining(hours, day.iso, time);
            return ended;
          });
        }
        return [...events, ...data];
      },
      []
    ),
    ...(calendar.length > 1 ? calendar[0].data : []).filter(event => {
      const hours = event._source.groupedHours.find(group =>
        group.days.find(day => day.iso === calendar[0].iso)
      );
      if (hours.days.length === 1) {
        const { ended } = timeRemaining(hours, calendar[0].iso, time);
        return ended;
      }
      return false;
    })
  ];

  const remainingTags = remainingEvents.reduce((tags, event) => {
    if (!taggedEvents.has(event._id)) {
      taggedEvents.add(event._id);
      event._source.tags.forEach(tag => {
        const tagList = tags[tag];
        if (!tagList) {
          tags[tag] = [];
        }
        tags[tag].push(event._id);
      });
    }
    return tags;
  }, {});

  const events = _.uniqBy(
    [
      ...yesterdayEvents,
      ...endingUpcomingEvents,
      ...upcomingEvents,
      ...remainingEvents
    ],
    "_id"
  );

  let firstEndingEvent;
  let firstEnd;
  let firstStartingEvent;
  let firstStart;

  if (endingUpcomingEvents.length) {
    firstEndingEvent = endingUpcomingEvents[0];
    const hours = firstEndingEvent._source.groupedHours.find(group =>
      group.days.find(day => day.iso === calendar[0].iso)
    );
    const { diff } = timeRemaining(hours, calendar[0].iso, time);
    firstEnd = diff;
  } else if (yesterdayEvents.length) {
    firstEndingEvent = yesterdayEvents[0];
    const hours = firstEndingEvent._source.groupedHours.find(group =>
      group.days.find(day => day.iso === yesterdayISO)
    );
    const { diff } = timeRemaining(hours, yesterdayISO, time);
    firstEnd = diff;
  }

  if (upcomingEvents.length) {
    firstStartingEvent = upcomingEvents[0];
    const hours = firstStartingEvent._source.groupedHours.find(group =>
      group.days.find(day => day.iso === calendar[0].iso)
    );
    const { diff } = timeRemaining(hours, calendar[0].iso, time);
    firstStart = diff;
  } else if (remainingEvents.length) {
    firstStartingEvent = remainingEvents[0];
    const iso = makeISO(firstStartingEvent._source.days, time);
    const hours = firstStartingEvent._source.groupedHours.find(group =>
      group.days.find(day => day.iso === iso)
    );
    const { diff } = timeRemaining(hours, iso, time);
    firstStart = diff;
  }

  let staleMs;

  if (firstEndingEvent && firstStartingEvent) {
    staleMs = Math.min(firstStart, firstEnd);
  } else if (firstEndingEvent) {
    staleMs = firstEnd;
  } else if (firstStartingEvent) {
    staleMs = firstStart;
  }

  return {
    staleMs,
    events,
    tags: {
      ending: endingTags,
      upcoming: upcomingTags,
      remaining: remainingTags
    }
  };
}

module.exports = {
  makeHours,
  groupHours,
  makeEvents,
  makeMarkers,
  makeListData,
  formatTo2400
};
