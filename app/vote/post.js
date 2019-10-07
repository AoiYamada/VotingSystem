const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const {
  Redis: { Vote },
  MySQL: { CampaignStat },
} = require(MODEL);
const { Encryption } = require(path.join(LIB, "Util"));

module.exports = [
  async (ctx, next) => {
    /**
     * @api {post} /vote/:campaign_uuid Vote a candidate
     * @apiGroup Vote
     * @apiDescription Vote a candidate
     * @apiParam {String} hkid
     * @apiParam {String} option
     * @apiSuccessExample {String} Success-Response:
     * HTTP/1.1 200 OK
     * 
     * @apiError (Error 4xx/5xx) {String} message Description of the error
     * @apiErrorExample {json} Error-Response:
     * {
     *     "message": "Something about the error"
     * }
     *
     */
    const { hkid, option } = ctx.request.body;
    const { vote_ID: campaign_uuid } = ctx.params;

    if (!hkid || typeof hkid != "string") {
      ctx.throw(400, "HKID_STRING_REQUIRED");
    }

    const hkid_md5 = Encryption.md5(hkid);

    await Vote.vote({
      hkid_md5,
      campaign_uuid,
      option
    });

    ctx.body = "";
  },
];