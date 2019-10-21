const sinon = require("sinon");
const imageLib = require("../processImages");
const saveLocations = require("../saveLocations");
const backup = require("../backupToS3");
const processImagesStub = sinon.stub(imageLib, "processImages");
const saveLocationsStub = sinon.stub(saveLocations, "saveLocations");
const backupStub = sinon.stub(backup, "backup");

const request = require("supertest");
const elastic = require("../schema/elastic");
const expect = require("chai").expect;

describe("test events", function() {
  let app;

  before(async function() {
    app = await require("../server")();

    await Promise.all([elastic.events.delete(), elastic.locations.delete()]);

    await Promise.all([elastic.events.map(), elastic.locations.map()]);
  });

  after(function() {
    processImagesStub.restore();

    saveLocationsStub.restore();

    backupStub.restore();
  });

  it("submits an event", async function() {
    this.timeout(0);

    const placeid = "ChIJYVhBRv8f3YARk6AVMfD1arU";

    processImagesStub.returns(Promise.resolve([]));

    saveLocationsStub.returns([Promise.resolve()]);

    backupStub.returns();

    const submissionRes = await request(app)
      .post("/api/save-event")
      .send({
        postCode: "",
        placeid,
        title: "Trivia Night",
        description: "Prizes for 1st - 3rd",
        days: [3],
        tags: ["trivia"]
      })
      .expect(res => {
        expect(res.body.error).to.not.exist;
        expect(res.body.submission.id).to.exist;
      });

    const fid = submissionRes.body.submission.id;

    const approvalRes = await request(app)
      .post("/api/save-event")
      .send({
        fid,
        postCode: process.env.POSTCODE,
        placeid,
        title: "Trivia Night",
        description: "Prizes for 1st - 3rd",
        days: [3],
        tags: ["trivia"]
      })
      .expect(res => {
        expect(res.body.error).to.not.exist;
        expect(res.body.event).to.exist;
      });

    expect(processImagesStub.getCall(0).args[0].place_id).to.equal(placeid);

    expect(saveLocationsStub.getCall(0).args.length).to.equal(2);

    const id = approvalRes.body.event._id;

    const updatedRes = await request(app)
      .post("/api/save-event")
      .send({
        id,
        postCode: process.env.POSTCODE,
        placeid: "ChIJYVhBRv8f3YARk6AVMfD1arU",
        title: "Trivia Night",
        description: "Prizes for 1st - 3rd",
        days: [3],
        tags: ["trivia", "happy hour"]
      })
      .expect(res => {
        expect(res.body.error).to.not.exist;
        expect(res.body.event._source.tags.length).to.equal(2);
      });

    expect(updatedRes.body.event._id).to.equal(id);

    await request(app)
      .post("/api/fetch-event")
      .send({
        id
      })
      .expect(res => {
        expect(res.body.error).to.not.exist;
        expect(res.body.events.length).to.equal(1);
      });
  });
});
