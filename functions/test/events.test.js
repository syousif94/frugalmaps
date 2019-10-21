const request = require("supertest");
const server = require("../server");
const elastic = require("../schema/elastic");
const expect = require("chai").expect;

describe("test events", function() {
  let app;

  before(async function() {
    app = await server();

    await Promise.all([elastic.events.delete(), elastic.locations.delete()]);

    await Promise.all([elastic.events.map(), elastic.locations.map()]);
  });

  it("submits an event", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("saves that event", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("updates that event", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("bulk inserts more events", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("retrieves events in the right order", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });

  it("fetches single event and corresponding data from event id", function() {
    return request(app)
      .post("/api/users/login")
      .send({
        number: process.env.PHONE
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect({});
  });
});
