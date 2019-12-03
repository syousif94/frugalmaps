const request = require("supertest");
const server = require("../server");
const elastic = require("../schema/elastic");
const event = require("../schema/event");
const esClient = require("../elastic");
const jwt = require("jsonwebtoken");
const expect = require("chai").expect;
const { setup, destroy } = require("./db");
const faker = require("faker");
const sh = require("shorthash");

describe("test users", function() {
  let app;

  let users = [];

  before(async function() {
    app = await server();
    await setup();
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
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("logs in a new user", function() {
    return request(app)
      .post("/api/users/token")
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
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("logs in an existing user", function() {
    return request(app)
      .post("/api/users/token")
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
      .post("/api/users/contacts")
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
      .post("/api/users/contacts")
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
      .post("/api/users/friends")
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
      .post("/api/users/friends")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;

        fid = res.body.friends[0]._source.fid;
      });

    const friendToken = jwt.sign({ id: fid }, process.env.JWT);

    await request(app)
      .post("/api/users/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .send({
        add: [id]
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await request(app)
      .post("/api/users/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        mute: [fid]
      })
      .expect(200);

    await elastic.friends.refresh();

    await request(app)
      .post("/api/users/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        const user = res.body.friends[0];
        expect(user._source.mutual).to.be.true;
        expect(user._source.muted).to.be.true;
      });

    await request(app)
      .post("/api/users/friends")
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
      .post("/api/users/friends")
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
      .post("/api/users/friends")
      .set("Authorization", `bearer ${friendToken}`)
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
        expect(res.body.friends[0]._source.mutual).to.be.false;
      });
  });

  // it("handles plans", function() {
  //   return request(app)
  //     .post("/api/users/plans")
  //     .expect(200)
  //     .expect("Content-Type", /json/)
  //     .expect({});
  // });

  it("handles interests", async function() {
    this.timeout(0);

    const id = sh.unique(process.env.PHONE);

    const token = jwt.sign({ id }, process.env.JWT);

    const friendId = sh.unique(users[0].number);

    const friendToken = jwt.sign({ id: friendId }, process.env.JWT);

    await elastic.events.refresh();

    const events = await esClient
      .search({
        index: event.index,
        body: {
          query: { match_all: {} }
        }
      })
      .then(res => res.hits.hits);

    // set up friendship
    // add interest for user
    // check interest from friend

    await request(app)
      .post("/api/users/friends")
      .set("Authorization", `bearer ${token}`)
      .send({
        add: [friendId]
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await request(app)
      .post("/api/users/account")
      .set("Authorization", `bearer ${token}`)
      .send({
        name: "James Testington"
      })
      .expect(200)
      .then(function(res) {
        expect(res.body.error).to.not.exist;
      });

    await request(app)
      .post("/api/users/interested")
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

    await elastic.friends.refresh();
    await elastic.interesteds.refresh();

    await request(app)
      .post("/api/users/feed")
      .set("Authorization", `bearer ${friendToken}`)
      .expect(200)
      .then(function(res) {
        console.log(res.body.interested);
        expect(res.body.error).to.not.exist;
      });
  });
});
