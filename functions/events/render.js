const fetch = require("isomorphic-fetch");
const fs = require("fs");
const Handlebars = require("handlebars");
const moment = require("moment");

const source = fs.readFileSync(`${__dirname}/event.html`, "utf8").toString();
const eventTemplate = Handlebars.compile(source);

const AWSCF = "https://dwrg27ehb8gnf.cloudfront.net/";
const API_URL = `https://us-central1-frugalmaps.cloudfunctions.net/api/fetch-event`;

function parse(response) {
  const { events } = response;

  const {
    _id: id,
    _source: { location, photos, city, address, website, phone, url }
  } = events[0];

  const thumbURL = `${AWSCF}${photos[0].mid.key}`;

  const eventCount = `${events.length} event${events.length > 1 ? "s" : ""}`;

  const description = `${location} · ${city} · ${eventCount}`;

  events.forEach(event => {
    event._source.groupedHours = groupHours(event._source);
  });

  return {
    location,
    id,
    city,
    eventCount,
    address,
    website,
    thumbURL,
    description,
    phone,
    url,
    events
  };
}

module.exports = async (req, res) => {
  let id = req.params.id;

  if (!id) {
    res.sendStatus(404);
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id
    })
  }).then(res => res.json());

  const data = parse(response);

  res.send(eventTemplate(data));
};

const DAYS = ["M", "T", "W", "Th", "F", "Sa", "S"];

const ISO_DAYS = [1, 2, 3, 4, 5, 6, 0];

function dayToISO(day) {
  return ISO_DAYS[day];
}

function formatTime(time) {
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

function makeHours(item, iso) {
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

function groupHours(source) {
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
