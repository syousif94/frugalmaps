const friendSchema = require("../schema/friend");
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
      friends: await getFriends(uid)
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

function updateFriendship(id, body) {
  return elastic.index({
    index: friendSchema.index,
    id,
    body
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
    mutual
  });

  const promises = [friendPromise];

  if (mutual) {
    const mutualPromise = elastic.update({
      index: friendSchema.index,
      id: friendId,
      body: {
        doc: {
          mutual
        }
      }
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

  const unmutualPromise = elastic
    .update({
      index: friendSchema.index,
      id: `${fid}_${uid}`,
      body: {
        doc: {
          mutual: false
        }
      }
    })
    .catch(() => {});

  await Promise.all([deletePromise, unmutualPromise]);
}

async function muteFriend(uid, fid) {
  const friendId = `${fid}_${uid}`;

  updateFriendship(friendId, {
    muted: true
  });
}

async function unmuteFriend(uid, fid) {
  const friendId = `${fid}_${uid}`;

  updateFriendship(friendId, {
    muted: false
  });
}

async function getFriends(uid) {
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

module.exports = {
  friends,
  getFriends
};
