const interestedSchema = require("../schema/interested");
const eventSchema = require("../schema/event");
const elastic = require("../elastic");
const { formatTo2400, makeHours } = require("../time");
const moment = require("moment");

async function interested(req, res) {
  const { id: uid } = req.user;

  const { event } = req.body;

  try {
    if (event) {
      await updateInterested(uid, event);
      res.send({});
    } else {
      const interested = await getOwnInterests(uid);
      res.send({
        interested
      });
    }
  } catch (error) {
    console.log(error.stack, req.body);
    res.send({
      error: error.message
    });
  }
}

async function updateInterested(uid, event) {
  const { eid, always = false, dates = [], utc = null, never = false } = event;

  let { time = null, days = [] } = event;
  time = time ? formatTo2400(time) : time;

  const docId = `${uid}_${eid}`;
  if (never) {
    await elastic.delete({
      index: interestedSchema.index,
      id: docId
    });
  } else if (always) {
    await elastic.index({
      index: interestedSchema.index,
      id: docId,
      body: {
        eid,
        always: true,
        time,
        uid,
        createdAt: Date.now()
      }
    });
  } else if ((dates.length && utc !== null) || days.length) {
    const eventDoc = await elastic
      .get({
        index: eventSchema.index,
        id: eid
      })
      .catch(err => {});

    if (!eventDoc) {
      throw new Error("Event could be found");
    }

    if (dates.length) {
      validateDatesForEvent(eventDoc, dates, utc, time);
      // days = dates.map(date => {
      //   const dateMoment = moment(date).utcOffset(utc);
      //   let day = dateMoment.weekday();
      //   day = !day ? 6 : day - 1;
      //   return day;
      // });
    } else if (days.length) {
      validateDaysForEvent(eventDoc, time, days);
    }

    // const body = {
    //   eid,
    //   uid,
    // }

    // if (dates) {

    // }

    // await elastic.index({
    //   index: interestedSchema.index,
    //   id: docId,
    //   body
    // })
  } else {
    throw new Error("Invalid options for event");
  }
}

function validateDatesForEvent(event, dates, utc, time) {
  return dates.reduce((valid, date) => {
    const dateMoment = moment(date).utcOffset(utc);
    let day = dateMoment.weekday();
    day = !day ? 6 : day - 1;
    const hasDay = event._source.days.includes(day);
    if (!hasDay && time) {
      const previousDay = !day ? 6 : day - 1;
      const hasPreviousDay = event._source.days.includes(previousDay);
      const { start, end } = makeHours({ item: event._source, day });
    }
  }, true);
}

function validateDaysForEvent(event, time = null, days = []) {
  const validDays = days.reduce((valid, day) => {
    const hasDay = event._source.days.includes(day);
    let validTime = true;
    if (time) {
      const { start, end } = makeHours({ item: event._source, day });
      const startInt = parseInt(start, 10);
      const endInt = parseInt(end, 10);
      const timeInt = parseInt(time, 10);
      if (startInt < endInt) {
        validTime = timeInt >= startInt && timeInt <= endInt;
      } else {
        validTime = timeInt >= startInt || timeInt <= endInt;
      }
    }
    return valid && hasDay && validTime;
  }, true);

  if (!validDays) {
    throw new Error("Invalid days for event");
  }
}

function getOwnInterests(uid) {
  return elastic
    .search({
      index: interestedSchema.index,
      body: {
        query: {
          term: { uid }
        }
      }
    })
    .then(res => res.hits.hits);
}

function getFriendsInterests(ids) {
  return elastic
    .search({
      index: interestedSchema.index,
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  uid: ids
                }
              }
            ],
            must_not: [
              {
                range: {
                  date: {
                    lt: "now"
                  }
                }
              }
            ]
          }
        },
        sort: [{ createdAt: "desc" }],
        size: 1000
      }
    })
    .then(res => res.hits.hits);
}

async function getInterestedFriendsForEvent(eid, uid) {
  return [];
}

async function interestedFriends(req, res) {
  const { id: uid } = req.user;

  const { eid } = req.body;

  try {
    const interestedFriends = await getInterestedFriendsForEvent(eid, uid);
    res.send({
      interestedFriends
    });
  } catch (error) {
    console.log(error.stack);
    res.send({
      error: error.message
    });
  }
}

module.exports = {
  interested,
  getFriendsInterests,
  interestedFriends
};
