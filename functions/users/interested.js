const interestedSchema = require("../schema/interested");
const eventSchema = require("../schema/event");
const elastic = require("../elastic");
const { formatTo2400, makeHours } = require("../time");
const moment = require("moment");
const _ = require("lodash");

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

  time = time ? _.mapValues(time, formatTo2400) : time;

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
  } else {
    throw new Error("Invalid options for event");
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
            should: [
              {
                bool: {
                  must: [
                    {
                      terms: {
                        uid: ids
                      }
                    },
                    {
                      range: {
                        dates: {
                          gte: "now"
                        }
                      }
                    }
                  ]
                }
              },
              {
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
                      exists: {
                        field: "dates"
                      }
                    }
                  ]
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
