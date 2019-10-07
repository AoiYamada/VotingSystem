const path = require("path");
const {
  PATHS: { MODEL, LIB },
} = require("config");
const {
  Redis: { Vote },
} = require(MODEL);
const {
  Encryption,
  QueryProcessor: { QueryProcessor },
} = require(path.join(LIB, "Util"));

module.exports = [
  async (ctx, next) => {
    /**
     * @api {get} /vote/:campaign_uuid Get Votes of a campaign
     * @apiGroup Vote
     * @apiDescription Get Votes of a campaign
     * @apiParam {String} [hkid] If the hkid is used to vote, the result will indicate the choice
     * @apiSuccess {Object} votes
     * @apiSuccess {Integer} votes.candidate_X Vote of the candidate_X
     * @apiSuccess {String} [your_vote] The candidate the hkid voted(if voted)
     * @apiSuccessExample {String} Success-Not-Vote:
     * HTTP/1.1 200 OK
     * {
     *     "votes": {
     *         "A": 0,
     *         "B": 0
     *     }
     * }
     * 
     * @apiSuccessExample {String} Success-Voted:
     * HTTP/1.1 200 OK
     * {
     *     "votes": {
     *         "A1": 1,
     *         "B2": 0
     *     },
     *     "your_vote": "A1"
     * }
     * 
     * @apiError (Error 4xx/5xx) {String} message Description of the error
     * @apiErrorExample {json} Error-Response:
     * {
     *     "message": "Something about the error"
     * }
     *
     */
    const query = QueryProcessor(ctx.querystring);
    const { hkid } = query;
    const { vote_ID: campaign_uuid } = ctx.params;

    if (!campaign_uuid) {
      ctx.throw(400, "CAMPAIGN_UUID_REQUIRED");
    }

    const result = {};
    result.votes = await Vote.getVotes(campaign_uuid);

    if (hkid) {
      const hkid_md5 = Encryption.md5(hkid);
      const your_vote = await Vote.getVote({ hkid_md5, campaign_uuid });
      if (your_vote) {
        result.your_vote = your_vote;
      }
    }

    ctx.body = result;
  },
];