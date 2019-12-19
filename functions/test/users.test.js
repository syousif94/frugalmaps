const request = require("supertest");
const server = require("../server");
const elastic = require("../schema/elastic");
const event = require("../schema/event");
const esClient = require("../elastic");
const jwt = require("jsonwebtoken");
const expect = require("chai").expect;
const { setup: setupDB, destroy } = require("./db");
const faker = require("faker");
const sh = require("shorthash");
const moment = require("moment");

describe("test users", function() {
  let app;

  let users = [];

  before(async function() {
    app = await server();
    await setupDB();
    await elastic.friends.delete();
    await elastic.contacts.delete();
    await elastic.users.delete();
    await elastic.interesteds.delete();
    await elastic.users.map();
    await elastic.contacts.map();
    await elastic.friends.map();
    await elastic.interesteds.map();

    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.fake("{{name.firstName}} {{name.lastName}}"),
        number: faker.phone.phoneNumberFormat().replace(/[^0-9.]+/g, "")
      });
    }
  });

  after(async function() {
    await destroy();
  });

  it("sends a login code", function() {
    return request(app)
      .post("/api/user/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("logs in a new user", function() {
    return request(app)
      .post("/api/user/token")
      .send({
        number: process.env.PHONE,
        code: "123456"
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        expect(res.body.user).to.equal(null);
        const decodedToken = jwt.verify(res.body.token, process.env.JWT);
        expect(decodedToken.id).to.equal(sh.unique(process.env.PHONE));
      });
  });

  it("sends another login code", function() {
    return request(app)
      .post("/api/user/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("logs in an existing user", function() {
    return request(app)
      .post("/api/user/token")
      .send({
        number: process.env.PHONE,
        code: "123456"
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        expect(res.body.user).to.exist;
        const decodedToken = jwt.verify(res.body.token, process.env.JWT);
        expect(decodedToken.id).to.equal(sh.unique(process.env.PHONE));
      });
  });

  it("adds contacts", async function() {
    const id = sh.unique(process.env.PHONE);

    const token = jwt.sign({ id }, process.env.JWT);

    await request(app)
      .post("/api/user/contacts")
      .set("Authorization", `bearer ${token}`)
      .send({
        contacts: users
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await elastic.contacts.refresh();

    await request(app)
      .post("/api/user/contacts")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        expect(res.body.contacts).to.exist;
        expect(res.body.contacts.length).to.eq(5);
      });
  });

  it("handles friends", async function() {
    this.timeout(0);

    const id = sh.unique(process.env.PHONE);

    const token = jwt.sign({ id }, process.env.JWT);

    const add = users.slice(0, 2).map(user => sh.unique(user.number));

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        add
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await elastic.friends.refresh();

    let fid;

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;

        fid = res.body.friends[0]._source.fid;
      });

    const friendToken = jwt.sign({ id: fid }, process.env.JWT);

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .send({
        add: [id]
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        mute: [fid]
      })
      .expect(200);

    await elastic.friends.refresh();

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        const user = res.body.friends[0];
        expect(user._source.mutual).to.be.true;
        expect(user._source.muted).to.be.true;
      });

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;

        const mutualFriend = res.body.friends.find(
          friend => friend._source.fid === fid
        );

        expect(mutualFriend).to.exist;

        expect(mutualFriend._source.mutual).to.be.true;
      });

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        remove: add
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await elastic.friends.refresh();

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        expect(res.body.friends[0]._source.mutual).to.be.false;
      });
  });

  // it("handles plans", function() {
  //   return request(app)
  //     .post("/api/user/plans")
  //     .expect(200)
  //     .expect("Content-Type", /json/)
  //     .expect({});
  // });

  it("creates interests", async function() {
    this.timeout(0);

    const id = sh.unique(process.env.PHONE);

    const token = jwt.sign({ id }, process.env.JWT);

    await elastic.events.refresh();

    const events = await esClient
      .search({
        index: event.index,
        body: {
          query: { match_all: {} }
        }
      })
      .then(res => res.hits.hits);

    const time = "3:30pm";

    await request(app)
      .post("/api/user/interested")
      .set("Authorization", `bearer ${token}`)
      .send({
        event: {
          eid: events[0]._id,
          time,
          days: [0, 1]
        }
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    const interestedDate = moment();

    interestedDate
      .day(3)
      .hour(15)
      .minute(30);

    if (interestedDate.isSameOrBefore(moment())) {
      interestedDate.add(7, "d");
    }

    console.log("interested date", interestedDate.format("h:mm a ddd M/D"));

    await request(app)
      .post("/api/user/interested")
      .set("Authorization", `bearer ${token}`)
      .send({
        event: {
          eid: events[0]._id,
          dates: [interestedDate.valueOf()],
          utc: interestedDate.utcOffset(),
          time
        }
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await request(app)
      .post("/api/user/interested")
      .set("Authorization", `bearer ${token}`)
      .send({
        event: {
          eid: events[0]._id,
          dates: [interestedDate.valueOf()],
          time
        }
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.exist;
      });
  });

  it("builds a friend feed", async function() {
    this.timeout(0);

    const id = sh.unique(process.env.PHONE);

    const token = jwt.sign({ id }, process.env.JWT);

    const friendIds = users.map(user => sh.unique(user.number));
    const friendTokens = friendIds.map(id => jwt.sign({ id }, process.env.JWT));

    await elastic.events.refresh();

    const events = await esClient
      .search({
        index: event.index,
        body: {
          query: { match_all: {} }
        }
      })
      .then(res => res.hits.hits);

    await request(app)
      .post("/api/user/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        add: friendIds
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await Promise.all(
      users.map((user, index) => {
        return request(app)
          .post("/api/user/friends")
          .set("Authorization", `bearer ${friendTokens[index]}`)
          .send({
            add: [id, ...friendIds.filter((id, i) => i !== index)]
          })
          .expect(200)
          .then(function(res) {
            expect(res.body.error).to.not.exist;
          });
      })
    );

    await request(app)
      .post("/api/user/account")
      .set("Authorization", `bearer ${token}`)
      .send({
        name: "James Testington"
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await Promise.all(
      users.map((user, index) => {
        return request(app)
          .post("/api/user/account")
          .set("Authorization", `bearer ${friendTokens[index]}`)
          .send({
            name: user.name
          })
          .expect(200)
          .then(function(res) {
            expect(res.body.error).to.not.exist;
          });
      })
    );

    await request(app)
      .post("/api/user/interested")
      .set("Authorization", `bearer ${token}`)
      .send({
        event: {
          eid: events[0]._id,
          always: true
        }
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await Promise.all(
      users.map((user, index) => {
        return request(app)
          .post("/api/user/interested")
          .set("Authorization", `bearer ${friendTokens[index]}`)
          .send({
            event: {
              eid: events[0]._id,
              always: true
            }
          })
          .expect(200)
          .then(function(res) {
            expect(res.body.error).to.not.exist;
          });
      })
    );

    await elastic.friends.refresh();
    await elastic.interesteds.refresh();

    await request(app)
      .post("/api/user/feed")
      .set("Authorization", `bearer ${friendTokens[0]}`)
      .expect(200)
      .then(function(res) {
        console.log(res.body);
        expect(Object.keys(res.body.friends).length).to.eq(5);
        expect(res.body.feed.length).to.eq(2);
        expect(res.body.events[0]._id).to.eq(events[0]._id);
        expect(res.body.error).to.not.exist;
      });
  });
});
