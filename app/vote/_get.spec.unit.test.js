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

  test("Get Votes of a Campaign (not vote)", async () => {
    const campaign = db_campaigns[Math.floor(Math.random() * db_campaigns.length)];
    const { id } = campaign;
    const response = await request.get(`/vote/${id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const result = {
      votes: {},
    };

    for (const option of campaign.options) {
      result.votes[option] = 0;
    }

    expect(response.body).toMatchObject(result);
  });

  test("Get Votes of a Campaign (voted)", async () => {
    const campaign = db_campaigns[Math.floor(Math.random() * db_campaigns.length)];
    const { id, options } = campaign;
    const to_vote = options[0];
    const hkid = "ABC123";

    await request.post(`/vote/${id}`)
      .send({
        hkid,
        option: to_vote,
      })
      .set("Accept", "text/plain")
      .expect("Content-Type", /text/)
      .expect(200);

    const response = await request.get(`/vote/${id}`)
      .query({
        hkid,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const result = {
      votes: {},
      your_vote: to_vote,
    };

    for (const option of options) {
      result.votes[option] = 0;
      if (option == to_vote) {
        result.votes[option]++;
      }
    }

    expect(response.body).toMatchObject(result);
  });

  afterAll(() => {
    redis.quit();
    Subscriber.quit();
    Publisher.quit();
    sequelize.close();
  });
});