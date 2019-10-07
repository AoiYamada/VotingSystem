const path = require("path");
const {
  PATHS: { LIB },
} = require("config");
const { Uuid } = require(path.join(LIB, "Util"));
const ERROR = require("./errors");

/**
 * @typedef {Object} Campaign
 * @property {Integer} id - uuid
 * @property {String} title
 * @property {Integer} start_time
 * @property {Integer} end_time
 * @property {String[]} options
 *
 */
module.exports = class Campaign {
  constructor(redis) {
    this.redis = redis;
  }
  /**
   * @param {Object} params
   * @param {String} params.title
   * @param {Integer} params.start_time - Unix Timestamp
   * @param {Integer} params.end_time - Unix Timestamp
   * @param {String[]} params.options - Options
   * @return {Campaign}
   *
   */
  async create({ title, start_time, end_time, options }) {
    if (!title)
      throw ERROR.MISSING_TITLE;

    if (!start_time)
      throw ERROR.MISSING_START_TIME;

    if (!end_time)
      throw ERROR.MISSING_END_TIME;

    if (typeof title != 'string')
      throw ERROR.TITLE_IS_NOT_STRING;

    if (start_time != parseInt(start_time) || end_time != parseInt(end_time))
      throw ERROR.TIME_IS_NOT_INTEGER;

    if (start_time < 0 || end_time < 0)
      throw ERROR.NEGATIVE_TIME;

    if (end_time - start_time < 0)
      throw ERROR.START_TIME_GREATER_THAN_END_TIME;

    if (!Array.isArray(options))
      throw ERROR.OPTIONS_SHOULD_BE_ARRAY;

    if (!options.length) {
      throw ERROR.OPTIONS_SHOULD_NOT_BE_EMPTY;
    }

    for (const option of options) {
      if (typeof option != "string" || !option)
        throw ERROR.OPTION_SHOULD_BE_STRING;
    }

    const uuid = Uuid();
    const campaign = {
      id: uuid,
      title,
      start_time,
      end_time,
      options: JSON.stringify(options),
    }

    await Promise.all([
      this.redis.zadd("campaigns", end_time, JSON.stringify(campaign)),
      this.redis.hmset(`campaigns:${uuid}`, campaign),
      this.redis.sadd(`options:${uuid}`, options),
    ]);

    return {
      ...campaign,
      options
    };
  }

  /**
   * @param {Object} params
   * @param {Integer} params.start - inclusive ranges
   * @param {Integer} params.stop - inclusive ranges
   * @return {Campaign[]}
   *
   */
  async selectAll(start = 0, stop = 10) {
    const count = await this.redis.zcard("campaigns");
    const campaigns = await this.redis.zrevrange("campaigns", start, stop);
    const rows = campaigns.map(campaign => {
      campaign = JSON.parse(campaign);
      campaign.options = JSON.parse(campaign.options);
      return campaign;
    });
    return {
      count,
      rows,
    };
  }

  /**
   * @param {String} campaign_uuid
   * @return {Campaign}
   *
   */
  async selectOne(campaign_uuid) {
    const result = await this.redis.hgetall(`campaigns:${campaign_uuid}`);

    if (!result.options) {
      throw ERROR.CAMPAIGN_NOT_EXIST;
    }
    result.start_time = parseInt(result.start_time);
    result.end_time = parseInt(result.end_time);
    result.options = JSON.parse(result.options);

    return result;
  }
}