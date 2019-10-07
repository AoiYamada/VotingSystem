const ERROR = require("./errors");
const { Publisher, Events } = require("../../notification");

module.exports = class Vote {
  constructor(redis) {
    this.redis = redis;
  }
  /**
   * @param {Object} params
   * @param {String} params.hkid_md5
   * @param {String} params.campaign_uuid
   * @param {String} params.option
   *
   */
  async vote({ hkid_md5, campaign_uuid, option }) {
    const campaign = await this.redis.hgetall(`campaigns:${campaign_uuid}`);
    if (!campaign.options) {
      throw ERROR.CAMPAIGN_NOT_EXIST;
    }

    const now = Date.now();
    const start_time = parseInt(campaign.start_time);
    const end_time = parseInt(campaign.end_time);
    if (now < start_time) {
      throw ERROR.CAMPAIGN_NOT_START;
    }
    if (now >= end_time) {
      throw ERROR.CAMPAIGN_ENDED;
    }

    campaign.options = JSON.parse(campaign.options);
    if (!campaign.options.includes(option)) {
      throw ERROR.OPTION_NOT_EXIST;
    }

    const vote_key = `vote:${hkid_md5}:${campaign_uuid}`;
    const voted = await this.redis.get(vote_key);

    if (voted && voted !== option) {
      throw ERROR.VOTED;
    }

    await Promise.all([
      this.redis.sadd(`votes:${campaign_uuid}:${option}`, hkid_md5),
      this.redis.set(vote_key, option),
    ]);

    const options = await this.getVotes(campaign_uuid);
    Publisher.publish(Events.VOTE, JSON.stringify({
      campaign_uuid,
      options,
    }));
  }

  /**
   * @param {Object} params
   * @param {String} params.hkid_md5
   * @param {String} params.campaign_uuid
   * @return {String} The voted option
   *
   */
  async getVote({ hkid_md5, campaign_uuid }) {
    const voted = await this.redis.get(`vote:${hkid_md5}:${campaign_uuid}`);
    return voted;
  }

  /**
   * @param {String} campaign_uuid
   * @return {Object} Vote counts(Integer) of each option of the campaign
   *
   */
  async getVotes(campaign_uuid) {
    const campaign = await this.redis.hgetall(`campaigns:${campaign_uuid}`);
    if (!campaign.options) {
      throw ERROR.CAMPAIGN_NOT_EXIST;
    }

    const options = JSON.parse(campaign.options);

    let votes = [];
    for (const option of options) {
      votes.push(this.redis.scard(`votes:${campaign_uuid}:${option}`));
    }

    votes = await Promise.all(votes);

    const result = Object.create(null);
    for (let i = 0; i < options.length; i++) {
      result[options[i]] = votes[i];
    }

    return result;
  }
}