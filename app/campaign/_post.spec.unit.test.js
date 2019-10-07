const supertest = require("supertest");
const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const {
  MySQL: { truncate, sequelize },
} = require(MODEL);

const redis = require(path.join(MODEL, "Redis", "redis"));
const { Subscriber, Publisher } = require(path.join(MODEL, "Redis", "notification"));

const { app } = require(path.join(LIB, "Server"));
const request = supertest(app.callback());

describe("Campaign POST", () => {
  const campaign = {
    "title": "Test",
    "start_time": 1569747525631,
    "end_time": 1669847525631,
    "options": [
      "A",
      "B"
    ]
  };

  beforeAll(async () => {
    await Promise.all([
      redis.flushdb(),
      truncate(),
    ]);
  });

  test("Create Campaign", async () => {
    const response = await request.post("/campaign")
      .send(campaign)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject(campaign);
  });

  afterAll(() => {
    redis.quit();
    Subscriber.quit();
    Publisher.quit();
    sequelize.close();
  });
});