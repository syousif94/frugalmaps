const interestedSchema = require("../schema/interested");
const eventSchema = require("../schema/event");
const elastic = require("../elastic");
const { formatTo2400, makeHours, groupHours } = require("../time");
const moment = require("moment");
const { getExternalFriendships, getExternalFriends } = require("./friends");
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
  const { eid, always = false, never = false, dates = [], days = [] } = event;

  let { times = {} } = event;

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
        times,
        uid,
        createdAt: Date.now()
      }
    });
  } else if (
    (days.length || dates.length) &&
    days.length + dates.length === _.size(times)
  ) {
    const eventDoc = await elastic
      .get({
        index: eventSchema.index,
        id: eid
      })
      .catch(err => {});

    if (!eventDoc) {
      throw new Error("Event could be found");
    }

    await elastic.index({
      index: interestedSchema.index,
      id: docId,
      body: {
        eid,
        days: days.length ? days : null,
        dates: dates.length ? dates : null,
        times,
        uid,
        createdAt: Date.now()
      }
    });
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

async function getInterestedFriendsForEvent(eid, fids) {
  const interested = await elastic
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
                      term: { eid }
                    },
                    {
                      terms: {
                        uid: fids
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
                      term: { eid }
                    },
                    {
                      terms: {
                        uid: fids
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
        }
      }
    })
    .then(res => res.hits.hits);

  return interested;
}

async function interestedFriends(req, res) {
  const { id: uid } = req.user;

  const { eid } = req.params;

  try {
    const friendships = await getExternalFriendships(uid);
    const fids = friendships.map(f => f._source.uid);
    const [interested, friends] = await Promise.all([
      getInterestedFriendsForEvent(eid, fids),
      getExternalFriends(fids)
    ]);
    res.send({
      interested,
      friends: _.keyBy(friends, "_id")
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
