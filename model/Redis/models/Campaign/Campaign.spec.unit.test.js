const redis = require("../../redis");
const Campaign = require("./");
const CampaignInst = new Campaign(redis);

const campaign = {
  title: "MyCampaign",
  start_time: Date.now(),
  end_time: Date.now() + 86400,
  options: ["Option, 01", "Option, 02", "Option, 03"],
};
let campaign_uuid;

beforeAll(() => {
  return redis.flushdb();
});

test("Create Campaign", async () => {
  const result = await CampaignInst.create(campaign);
  campaign_uuid = result.id;
  expect(result).toMatchObject(campaign);
});

test("Select Campaigns", async () => {
  const result = await CampaignInst.selectAll();
  expect(result.count).toBe(1);
  expect(result.rows[0]).toMatchObject(campaign);
});

test("Select one Campaign", async () => {
  const result = await CampaignInst.selectOne(campaign_uuid);
  expect(result).toMatchObject(campaign);
});

afterAll(async () => {
  await Promise.all([
    // redis.flushdb(),
    redis.quit(),
  ]);
});