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
      const interested = getInterested(uid);
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

async function getInterested(uid) {
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

async function interestedFriends(req, res) {}

module.exports = {
  interested,
  interestedFriends
};
