const { Expo } = require("expo-server-sdk");
const elastic = require("./elastic");
const user = require("./schema/user");

const expo = new Expo();

module.exports = async function notifyNearby(req, res) {
  try {
    const { postCode, doc, after, id } = req.body;

    if (postCode !== process.env.POSTCODE) {
      throw new Error("Invalid Code");
    }

    const body = {
      query: {
        bool: {
          must: [{ match_all: {} }],
          filter: {
            geo_distance: {
              distance: "45mi",
              coordinates: doc.coordinates
            }
          }
        }
      },
      size: 1000
    };

    if (after) {
      body.search_after = `user#${after}`;
    }

    const users = await elastic
      .search({
        index: user.index,
        type: user.type,
        body
      })
      .then(res => res.hits.hits);

    if (users.length) {
      const messages = users.reduce((acc, cur) => {
        const token = cur._source.pushtoken;

        const isToken = Expo.isExpoPushToken(token);

        if (isToken) {
          acc.push({
            to: token,
            sound: "default",
            title: `${doc.title} just added!`,
            body: `${doc.location}, ${doc.city} · ${doc.description}`,
            data: { id }
          });
        }

        return acc;
      }, []);

      const chunks = expo.chunkPushNotifications(messages);

      const tickets = [];

      for (const chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.log({
            notifyUsersChunkError: error.message
          });
        }
      }

      if (users.length === 1000) {
        const lastUserId = users[999]._id;
        const url = `https://us-central1-frugalmaps.cloudfunctions.net/api/notify-nearby`;

        const payload = {
          doc,
          id,
          after: lastUserId,
          postCode: process.env.POSTCODE
        };

        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }
    }

    res.send(200);
  } catch (error) {
    console.log({
      notifyUsersError: error.message
    });
    res.send({
      error: error.message
    });
  }
};
