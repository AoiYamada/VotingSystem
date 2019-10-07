const supertest = require("supertest");
const moment = require("moment");
const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const {
  MySQL: { truncate, sequelize },
} = require(MODEL);

const Uuid = require(path.join(LIB, "Util", "Uuid"));
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
      "end_time": 1669847535632,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test3",
      "start_time": 1569747525631,
      "end_time": 1669847545631,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test4",
      "start_time": 1569747525631,
      "end_time": 1669847555630,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "Test5",
      "start_time": 1569747525631,
      "end_time": 1669847565629,
      "options": [
        "A",
        "B"
      ]
    }, {
      "title": "End",
      "start_time": 1569747525631,
      "end_time": Date.now() - 1000,
      "options": [
        "A",
        "B"
      ]
    }
  ];

  const db_campaigns = [];
  const list_results = [];

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

    for (const [idx, campaign] of Object.entries(db_campaigns)) {
      const { id, options } = campaign;
      const will_vote = 10 + ~~idx;
      const list_result = {
        ...campaign,
        start_time: moment(campaign.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment(campaign.end_time).format("YYYY-MM-DD HH:mm:ss"),
        options: {},
        total_votes: 0,
      };

      for (const option of options) {
        list_result.options[option] = 0;
      }

      if (campaign.title !== "End") {
        list_result.total_votes = will_vote;

        for (let i = 0; i < will_vote; i++) {
          const hkid = Uuid();
          const to_vote = options[Math.floor(Math.random() * options.length)];

          await request.post(`/vote/${id}`)
            .send({
              hkid,
              option: to_vote,
            });

          list_result.options[to_vote]++;
        }
      }

      list_results.push(list_result);
    }

    list_results.sort((a, b) => {
      if (a.title == "End") return 1;
      if (b.title == "End") return -1;

      return b.total_votes - a.total_votes;
    });
  });

  test("Get List of Votes", async () => {
    const response = await request.get("/list")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject(list_results);
  });

  afterAll(() => {
    redis.quit();
    Subscriber.quit();
    Publisher.quit();
    sequelize.close();
  });
});