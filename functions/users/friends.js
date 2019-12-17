const friendSchema = require("../schema/friend");
const userSchema = require("../schema/user");
const elastic = require("../elastic");

async function friends(req, res) {
  try {
    const { id: uid } = req.user;

    const { add = [], remove = [], mute = [], unmute = [] } = req.body;

    if (add.length || remove.length || mute.length || unmute.length) {
      await updateFriends(uid, add, remove, mute, unmute);
      res.send({});
      return;
    }

    res.send({
      friends: await getOwnFriendships(uid)
    });
  } catch (error) {
    res.send({
      error: error.message
    });
  }
}

async function updateFriends(uid, add, remove, mute, unmute) {
  const addPromises = add.map(fid => addFriend(uid, fid));
  const removePromises = remove.map(fid => removeFriend(uid, fid));
  const mutePromises = mute.map(fid => muteFriend(uid, fid));
  const unmutePromises = unmute.map(fid => unmuteFriend(uid, fid));

  await Promise.all([
    ...addPromises,
    ...removePromises,
    ...mutePromises,
    ...unmutePromises
  ]);
}

function updateFriendship(id, doc) {
  return elastic.update({
    index: friendSchema.index,
    id,
    body: {
      doc,
      doc_as_upsert: true
    }
  });
}

async function addFriend(uid, fid) {
  const friendId = `${fid}_${uid}`;

  const mutual = await elastic
    .exists({
      index: friendSchema.index,
      id: friendId
    })
    .catch(err => {});

  const friendPromise = updateFriendship(`${uid}_${fid}`, {
    uid,
    fid,
    mutual,
    createdAt: Date.now()
  });

  const promises = [friendPromise];

  if (mutual) {
    const mutualPromise = updateFriendship(friendId, {
      mutual
    });
    promises.push(mutualPromise);
  }

  await Promise.all(promises);
}

async function removeFriend(uid, fid) {
  const deletePromise = elastic.delete({
    index: friendSchema.index,
    id: `${uid}_${fid}`
  });

  const unmutualPromise = updateFriendship(`${fid}_${uid}`, {
    mutual: false
  });

  await Promise.all([deletePromise, unmutualPromise]);
}

async function muteFriend(uid, fid) {
  const friendId = `${fid}_${uid}`;

  await updateFriendship(friendId, {
    muted: true
  });
}

async function unmuteFriend(uid, fid) {
  const friendId = `${fid}_${uid}`;

  await updateFriendship(friendId, {
    muted: false
  });
}

async function getOwnFriendships(uid) {
  const friends = await elastic
    .search({
      index: friendSchema.index,
      body: {
        query: {
          term: { uid }
        }
      }
    })
    .then(res => res.hits.hits);

  return friends;
}

async function getExternalFriendships(uid) {
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

  return friendships;
}

async function getExternalFriends(ids) {
  const friends = await elastic
    .mget({
      index: userSchema.index,
      body: {
        ids
      },
      _source_excludes: ["number"]
    })
    .then(res => res.docs);

  return friends;
}

module.exports = {
  friends,
  getOwnFriendships,
  getExternalFriendships,
  getExternalFriends
};
