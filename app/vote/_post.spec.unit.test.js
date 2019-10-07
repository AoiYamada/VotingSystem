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

describe("Vote POST", () => {
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

  test("Vote Campaign", async () => {
    const hkid = "ABC123";
    const campaign = db_campaigns[Math.floor(Math.random() * db_campaigns.length)];
    const { id, options } = campaign;

    const response = await request.post(`/vote/${id}`)
      .send({
        hkid,
        option: options[0],
      })
      .set("Accept", "text/plain")
      .expect("Content-Type", /text/)
      .expect(200);

    expect(response.text).toBe("");
  });

  afterAll(() => {
    redis.quit();
    Subscriber.quit();
    Publisher.quit();
    sequelize.close();
  });
});