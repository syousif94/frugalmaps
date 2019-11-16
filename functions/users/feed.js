const friendSchema = require("../schema/friend");
const interestedSchema = require("../schema/interested");
const elastic = require("../elastic");

async function getFeed(req, res) {
  const { id: uid } = req.user

  const [ids, nonmutual] = await getFriends(uid)

  const interested = elastic.search({

  })

  const 
}

async function getFriends(uid) {
  const friends = await elastic.search({
    index: friendSchema.index,
    body: {
      query: {
        term: {
          fid: uid
        },
      },
      sort: {},
      size: 1000
    }
  }).then(res => res.hits.hits)

  const ids = []
  const nonmutual = []

  return [ids, nonmutual]
}