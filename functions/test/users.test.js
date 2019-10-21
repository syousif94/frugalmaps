const request = require("supertest");
const server = require("../server");
const elastic = require("../schema/elastic");
const jwt = require("jsonwebtoken");
const expect = require("chai").expect;

describe("test users", function() {
  let app;

  before(async function() {
    app = await server();
    await elastic.users.delete();
    await elastic.users.map();
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

  // it("adds contacts", function() {
  //   return request(app)
  //     .post("/api/users/contacts")
  //     .send({
  //       token: ,

  //     })
  //     .expect(200)
  //     .expect("Content-Type", /text/)
  //     .expect("FrugalMaps API says hi");
  // });

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
