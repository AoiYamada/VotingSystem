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

describe("Campaign GET", () => {
  // end_time DESC matters
  const campaigns = [
    {
      "title": "Test1",
      "start_time": 1569747525631,
      "end_time": 1669847525633,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test2",
      "start_time": 1569747525631,
      "end_time": 1669847525632,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test3",
      "start_time": 1569747525631,
      "end_time": 1669847525631,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test4",
      "start_time": 1569747525631,
      "end_time": 1669847525630,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test5",
      "start_time": 1569747525631,
      "end_time": 1669847525629,
      "options": [
        "A",
        "B"
      ]
    }
  ];

  const db_campaigns = [];

  beforeAll(async () => {
    await Promise.all([
      redis.flushdb(),
      truncate(),
    ]);

    for (const campaign of campaigns) {
      db_campaigns.push((await request.post("/campaign")
        .send(campaign)
        .set("Accept", "application/json")
      ).body);
    }
  });

  test("Get Campaign with ID", async () => {
    const target = db_campaigns[Math.floor(Math.random() * db_campaigns.length)];
    const { id } = target;
    const response = await request.get(`/campaign/${id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject(target);
  });

  test("Get Campaign without ID", async () => {
    const response = await request.get(`/campaign`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.count).toBe(5);
    expect(response.body.rows).toMatchObject(db_campaigns);
  });

  afterAll(() => {
    redis.quit();
    Subscriber.quit();
    Publisher.quit();
    sequelize.close();
  });
});