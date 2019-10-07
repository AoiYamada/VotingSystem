const redis = require("../../redis");
const { Subscriber, Publisher } = require("../../notification");
const Campaign = require("../Campaign");
const CampaignInst = new Campaign(redis);
const Vote = require(".");
const VoteInst = new Vote(redis);
const ERROR = require("./errors");

describe("Vote an active Campaign", () => {
  const campaign = {
    title: "MyCampaign",
    start_time: Date.now(),
    end_time: Date.now() + 86400,
    options: ["Option, 01", "Option, 02", "Option, 03"],
  };
  let campaign_uuid;
  const hkid_md5s = ["A", "B", "C", "D"];

  beforeAll(async () => {
    await redis.flushdb();
    const result = await CampaignInst.create(campaign);
    campaign_uuid = result.id;
  });

  test("Vote", () => {
    const { options } = campaign;
    const votes = [];
    for (const [idx, hkid_md5] of Object.entries(hkid_md5s)) {
      votes.push(VoteInst.vote({
        hkid_md5,
        campaign_uuid,
        option: options[idx % options.length],
      }));
    }
    return Promise.all(votes);
  });

  test("Get Vote", async () => {
    const { options } = campaign;
    let votes = [];
    for (const hkid_md5 of hkid_md5s) {
      votes.push(VoteInst.getVote({
        hkid_md5,
        campaign_uuid,
      }));
    }

    votes = await Promise.all(votes);
    for (const [idx, vote] of Object.entries(votes)) {
      expect(vote).toBe(options[idx % options.length]);
    }
  });

  test("Get Votes", async () => {
    const { options } = campaign;
    const votes = await VoteInst.getVotes(campaign_uuid);
    const basic_votes = Math.floor(hkid_md5s.length / options.length);
    const one_more_vote_idx = hkid_md5s.length % options.length;

    for (const [idx, option] of Object.entries(options)) {
      const vote = votes[option];
      const expected_vote = idx < one_more_vote_idx ? basic_votes + 1 : basic_votes;
      expect(vote).toBe(expected_vote);
    }
  });
});

describe("Vote an expired Campaign", () => {
  const campaign = {
    title: "MyExpiredCampaign",
    start_time: Date.now() - 86400,
    end_time: Date.now(),
    options: ["Option, 01", "Option, 02", "Option, 03"],
  };
  let campaign_uuid;
  const hkid_md5 = "A";

  beforeAll(async () => {
    await redis.flushdb();
    const result = await CampaignInst.create(campaign);
    campaign_uuid = result.id;
  });

  test("Vote: Expired", async () => {
    const { options } = campaign;
    try {
      await VoteInst.vote({
        hkid_md5,
        campaign_uuid: campaign_uuid,
        option: options[0],
      });
    } catch (error) {
      expect(error).toBe(ERROR.CAMPAIGN_ENDED);
    }
  });
});

afterAll(async () => {
  await Promise.all([
    // redis.flushdb(),
    redis.quit(),
    Subscriber.quit(),
    Publisher.quit(),
  ]);
});