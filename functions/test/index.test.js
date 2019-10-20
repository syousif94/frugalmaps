const request = require("supertest");
const server = require("../server");

describe("test server", function() {
  let app;

  before(async function() {
    app = await server();
  });

  it("api is running", async function() {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", /text/)
      .expect("FrugalMaps API says hi");
  });
});
