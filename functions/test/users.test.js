const request = require("supertest");
const server = require("../server");
const elastic = require("../schema/elastic");
const jwt = require("jsonwebtoken");
const expect = require("chai").expect;
const { setup, destroy } = require("./db");
const faker = require("faker");

describe("test users", function() {
  let app;

  let users = [];

  before(async function() {
    app = await server();
    await setup();
    await elastic.users.delete();
    await elastic.users.map();

    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.fake("{{name.firstName}} {{name.lastName}}"),
        number: faker.phone.phoneNumberFormat().replace(/[^0-9\.]+/g, "")
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
        expect(decodedToken.number).to.equal(process.env.PHONE);
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
        expect(decodedToken.number).to.equal(process.env.PHONE);
      });
  });

  it("adds contacts", async function() {
    const { body: token } = await request(app)
      .post("/api/users/token")
      .send({
        number: process.env.PHONE,
        code: "123456"
      })
      .expect(200);

    await request(app)
      .post("/api/users/contacts")
      .send({
        token,
        contacts: [
          {
            name: "",
            number: ""
          }
        ]
      })
      .expect(200)
      .expect({});

    await request(app)
      .post("/api/users/contacts")
      .send({
        token
      })
      .expect(200)
      .expect({});
  });

  // it("adds friends", function() {
  //   return request(app)
  //     .post("/api/users/create")
  //     .expect(200)
  //     .expect("Content-Type", /text/)
  //     .expect("FrugalMaps API says hi");
  // });

  // it("gets plans", function() {
  //   return request(app)
  //     .post("/api/users/plans")
  //     .expect(200)
  //     .expect("Content-Type", /json/)
  //     .expect({});
  // });

  // it("gets interested friends", function() {
  //   return request(app)
  //     .post("/api/users/create")
  //     .expect(200)
  //     .expect("Content-Type", /text/)
  //     .expect("FrugalMaps API says hi");
  // });
});
