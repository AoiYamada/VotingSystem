const {
  PATHS: { MODEL },
} = require("config");
const {
  Redis: { Campaign },
  MySQL: { CampaignStat },
} = require(MODEL);

module.exports = [
  // TODO: Add JSON Schema middleware here to validate the input
  async (ctx, next) => {
    /**
     * @api {post} /campaign Create Campaign
     * @apiGroup Campaign
     * @apiDescription Create Campaign
     * @apiParam {String} title
     * @apiParam {Integer} start_time Unix Timestamp
     * @apiParam {Integer} end_time Unix Timestamp
     * @apiParam {String[]} options Candidates
     * @apiSuccess {[Campaign](#api-_Custom_types-ObjectCampaign)} Campaign
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": "dc870fb8-63a9-4be2-87e6-7ff8cde88f14",
     *     "title": "Test3",
     *     "start_time": 1569747525631,
     *     "end_time": 1569847525631,
     *     "options": [
     *         "A1",
     *         "B2"
     *     ]
     * }
     * 
     * @apiError (Error 4xx/5xx) {String} message Description of the error
     * @apiErrorExample {json} Error-Response:
     * {
     *     "message": "Something about the error"
     * }
     *
     */
    const { title, start_time, end_time, options } = ctx.request.body;
    const campaign = {
      title,
      start_time,
      end_time,
      options,
    };

    const result = await Campaign.create(campaign);
    await CampaignStat.create({
      ...result,
      start_time: new Date(result.start_time),
      end_time: new Date(result.end_time),
      options: result.options.reduce((vote_of_options, option) => {
        vote_of_options[option] = 0;
        return vote_of_options;
      }, Object.create(null))
    });

    ctx.body = result;
  },
];