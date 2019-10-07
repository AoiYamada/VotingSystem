const redis = require("./redis");
const Campaign = require("./models/Campaign");
const Vote = require("./models/Vote");

const CampaignInst = new Campaign(redis);
const VoteInst = new Vote(redis);

module.exports = {
  Campaign: CampaignInst,
  Vote: VoteInst,
}