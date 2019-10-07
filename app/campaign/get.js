const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const {
  Redis: { Campaign },
} = require(MODEL);
const {
  QueryProcessor: { QueryProcessor, Paging },
} = require(path.join(LIB, "Util"));

module.exports = [
  async (ctx, next) => {
    /**
     * @api {get} /campaign/:campaign_uuid Get Campaign List
     * @apiGroup Campaign
     * @apiDescription Get Campaign List
     * @apiParam {String} [page=0]
     * @apiParam {String} [limit=10] rows per page
     * @apiSuccess (Without Campaign Uuid) {Integer} count Total number of campaigns
     * @apiSuccess (Without Campaign Uuid) {String} next Url for getting next page's data with same limit
     * @apiSuccess (Without Campaign Uuid) {String} prev Url for getting previous page's data with same limit
     * @apiSuccess (Without Campaign Uuid) {[Campaign[]](#api-_Custom_types-ObjectCampaign)} rows
     * @apiSuccessExample {json} Without-Campaign-Uuid:
     * HTTP/1.1 200 OK
     * {
     *     "count": 2,
     *     "rows": [
     *         {
     *             "id": "aefcd022-055b-4794-8319-ed21d23e4bc4",
     *             "title": "MyCampaign",
     *             "start_time": 1569741708823,
     *             "end_time": 1569741795223,
     *             "options": [
     *                 "Option, 01",
     *                 "Option, 02",
     *                 "Option, 03"
     *             ]
     *         },
     *         {
     *             "id": "ec0687f5-945d-4f2b-9533-0a4880f0e160",
     *             "title": "MyCampaign2",
     *             "start_time": 1569741622423,
     *             "end_time": 1569741708823,
     *             "options": [
     *                 "Option, 01",
     *                 "Option, 02",
     *                 "Option, 03"
     *             ]
     *         }
     *     ]
     * }
     * 
     * @apiSuccess (With Campaign Uuid) {[Campaign](#api-_Custom_types-ObjectCampaign)} Campaign
     * @apiSuccessExample {json} With-Campaign-Uuid:
     * HTTP/1.1 200 OK
     * {
     *     "id": "aefcd022-055b-4794-8319-ed21d23e4bc4",
     *     "title": "MyCampaign",
     *     "start_time": 1569741708823,
     *     "end_time": 1569741795223,
     *     "options": [
     *         "Option, 01",
     *         "Option, 02",
     *         "Option, 03"
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
    const { campaign_ID } = ctx.params;
    const { start, stop } = QueryProcessor(ctx.querystring);

    if (campaign_ID) {
      const campaign = await Campaign.selectOne(campaign_ID);
      ctx.body = campaign;
    } else {
      const campaigns = await Campaign.selectAll(start, stop);
      ctx.body = Paging(campaigns, ctx);
    }
  },
];
