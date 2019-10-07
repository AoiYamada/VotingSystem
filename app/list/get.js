const moment = require("moment");
const { Op } = require("sequelize");
const {
  PATHS: { MODEL },
} = require("config");
const {
  Redis: { Vote },
  MySQL: { CampaignStat },
} = require(MODEL);

let cache;
const CACHE_TIMEOUT = 10; // minutes

module.exports = [
  async (ctx, next) => {
    /**
     * @api {get} /list Get Active Campaign List
     * @apiGroup Campaign
     * @apiDescription A list to display all voting campaign. i- display campaigns within start/end time first and order by total no. of votes. ii- display most recent ended campaign afterward. There is around 10 mins delay about the vote count.
     * @apiSuccess {String} id Uuid of the campaign created
     * @apiSuccess {String} title
     * @apiSuccess {String} start_time YYYY-MM-DD HH:mm:ss
     * @apiSuccess {String} end_time YYYY-MM-DD HH:mm:ss
     * @apiSuccess {Object} options Candidates with votes
     * @apiSuccess {Integer} total_votes
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": "ae78c0a4-1183-40b5-b601-0df5b8405194",
     *         "title": "Test3",
     *         "start_time": "2019-09-29 15:55:42",
     *         "end_time": "2022-11-30 01:44:02",
     *         "options": {
     *             "A": 1,
     *             "B": 0
     *         },
     *         "total_votes": 1
     *     }
     * ]
     * 
     * @apiError (Error 4xx/5xx) {String} message Description of the error
     * @apiErrorExample {json} Error-Response:
     * {
     *     "message": "Something about the error"
     * }
     *
     */
    const now = new Date();
    if (!cache) {
      let campaign_stats = await CampaignStat.findAll({
        where: {
          start_time: {
            [Op.lte]: now,
          },
          end_time: {
            [Op.gt]: now,
          }
        },
      });

      const last_ended_campaign = await CampaignStat.findOne({
        where: {
          end_time: {
            [Op.lte]: now,
          }
        },
        ordering: [["end_time", "DESC"]]
      });

      if (last_ended_campaign) {
        campaign_stats.push(last_ended_campaign);
      }

      campaign_stats = await Promise.all(campaign_stats.map(async campaign_stat => {
        const toUpdate = Object.create(null);
        toUpdate.start_time = moment(campaign_stat.start_time).format("YYYY-MM-DD HH:mm:ss");
        toUpdate.end_time = moment(campaign_stat.end_time).format("YYYY-MM-DD HH:mm:ss");
        toUpdate.options = await Vote.getVotes(campaign_stat.id);
        toUpdate.total_votes = Object.keys(toUpdate.options).reduce((count_votes, option) => {
          count_votes += parseInt(toUpdate.options[option]);
          return count_votes;
        }, 0);
        await campaign_stat.update(toUpdate);
        return {
          id: campaign_stat.id,
          title: campaign_stat.title,
          ...toUpdate,
        };
      }));

      campaign_stats.sort((a, b) => {
        if (moment(b.end_time) >= now) {
          // display campaigns within start/end time first and order by total no. of votes.
          return b.total_votes - a.total_votes;
        } else {
          // display most recent ended campaign afterward
          return -1;
        }
      });

      setTimeout(() => cache = undefined, CACHE_TIMEOUT * 60 * 1000);

      ctx.body = cache = campaign_stats;
    } else {
      ctx.body = cache;
    }
  },
];
