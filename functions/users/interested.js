const interestedSchema = require("../schema/interested");
const elastic = require("../elastic");

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
    console.log(error.stack);
    res.send({
      error: error.message
    });
  }
}

async function updateInterested(uid, event) {
  const {
    eid,
    always = false,
    date = null,
    day = null,
    time = null,
    never = false
  } = event;

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
  } else if (date || day) {
    try {
      const eventDoc = await elastic.get({
        index: interestedSchema.index,
        id: docId
      });
      console.log({ eventDoc });
    } catch (error) {
      console.log(error);
    }
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
