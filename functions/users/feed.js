const friendSchema = require("../schema/friend");
const interestedSchema = require("../schema/interested");
const userSchema = require("../schema/user");
const eventSchema = require("../schema/event");
const elastic = require("../elastic");
const _ = require("lodash");

async function getFeed(req, res) {
  const { id: uid } = req.user;

  try {
    const [ids, nonmutual, friendMap] = await getFriends(uid);

    const interested = await getInterested(ids, friendMap);

    res.send({ interested });
  } catch (error) {
    console.log(error.stack);
    res.send({
      error: error.message
    });
  }
}

async function getFriends(uid) {
  const friendships = await elastic
    .search({
      index: friendSchema.index,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  fid: uid
                }
              }
            ],
            must_not: [
              {
                term: {
                  muted: true
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

  const friendMap = new Map();
  const ids = [];
  const nonmutual = [];

  friendships.forEach(friend => {
    ids.push(friend._source.uid);
    if (!friend._source.mutual) {
      nonmutual.push(friend._source.uid);
    }
  });

  const friends = await elastic
    .mget({
      index: userSchema.index,
      body: {
        ids
      }
    })
    .then(res => res.docs);

  friends.forEach(friend => {
    friendMap.set(friend._id, friend);
  });

  return [ids, nonmutual, friendMap];
}

async function getInterested(ids, friendMap) {
  const interested = await elastic
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

  const interestedMap = _.groupBy(interested, "_source.eid");

  const events = await elastic
    .mget({
      index: eventSchema.index,
      body: {
        ids: Object.keys(interestedMap)
      }
    })
    .then(res => res.docs);

  return events.map(doc => {
    const interested = interestedMap[doc._id];
    const friends = interested.map(
      i => friendMap.get(i._source.uid)._source.name
    );
    let text;
    switch (friends.length) {
      case 1:
        text = `${friends[0]} is interested.`;
        break;
      case 2:
        text = `${friends[0]} and ${friends[1]} are interested.`;
        break;
      default:
        text = `${friends.slice(-1).join(", ")}, and ${
          friends[friends.length - 1]
        } are interested`;
    }
    return {
      type: "interested",
      eid: doc._id,
      title: doc._source.title,
      text,
      friendIds: [],
      createdAt: interested[0].createdAt
    };
  });
}

module.exports = getFeed;
