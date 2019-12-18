const eventSchema = require("../schema/event");
const { getExternalFriendships, getExternalFriends } = require("./friends");
const { getFriendsInterests } = require("./interested");
const elastic = require("../elastic");
const _ = require("lodash");

async function getFeed(req, res) {
  const { id: uid } = req.user;

  try {
    const [ids, nonmutual, friendMap] = await getFriends(uid);

    const [interested, events] = await getInterested(ids, friendMap);

    const feed = _.orderBy([...interested, ...nonmutual], "createdAt", "desc");

    res.send({ feed, friends: Object.fromEntries(friendMap), events });
  } catch (error) {
    console.log(error.stack);
    res.send({
      error: error.message
    });
  }
}

async function getFriends(uid) {
  const friendships = await getExternalFriendships(uid);

  const friendMap = new Map();
  const ids = [];
  const nonmutual = [];

  friendships.forEach(friend => {
    ids.push(friend._source.uid);
    if (!friend._source.mutual) {
      nonmutual.push({
        type: "newFriend",
        createdAt: friend._source.createdAt,
        id: friend._source.uid
      });
    }
  });

  const friends = await getExternalFriends(ids);

  friends.forEach(friend => {
    friendMap.set(friend._id, friend);
  });

  return [ids, nonmutual, friendMap];
}

async function getPlans(ids) {}

async function getInterested(ids, friendMap) {
  const interested = await getFriendsInterests(ids);

  const interestedMap = _.groupBy(interested, "_source.eid");

  const events = await elastic
    .mget({
      index: eventSchema.index,
      body: {
        ids: Object.keys(interestedMap)
      }
    })
    .then(res => res.docs);

  const list = events.map(doc => {
    let interested = interestedMap[doc._id];
    const ids = [];
    const friends = [];
    interested.forEach(i => {
      const friend = friendMap.get(i._source.uid);
      friends.push(friend._source.name.split(" ")[0]);
      ids.push(friend._id);
    });

    let text;
    switch (friends.length) {
      case 1:
        text = `${friends[0]} is interested.`;
        break;
      default:
        text = `${friends.slice(0, -1).join(", ")} and ${
          friends[friends.length - 1]
        } are interested`;
    }
    return {
      type: "interested",
      eid: doc._id,
      text,
      ids,
      createdAt: interested[0]._source.createdAt
    };
  });

  return [list, events];
}

module.exports = getFeed;
