const qs = require("qs");

const Core = querystring => {
  const query = qs.parse(querystring);
  if (query.limit) {
    if (query.limit != parseInt(query.limit)) {
      throw Symbol("Limit should be number");
    }
  }
  if (query.page) {
    if (query.page != parseInt(query.page)) {
      throw Symbol("Page should be number");
    }
  }

  return {
    limit: 10,
    page: 1,
    ...query,
  };
};

const QueryProcessor = querystring => {
  const query = Core(querystring);
  let { limit, page } = query;
  delete query.page;

  limit = parseInt(limit);
  page = parseInt(page);

  const start = (page - 1) * limit;
  const stop = start + limit - 1;

  return {
    start,
    stop,
    ...query,
  };
};

const NextPageQuery = (results, query, prefix) => {
  const lastPage = Math.ceil(results.count / query["limit"]);
  page = ~~query["page"] + 1;
  if (page <= lastPage) {
    return {
      ...results,
      next: `${prefix}?${qs.stringify(
        {
          ...query,
          page,
        },
        { encode: false }
      )}`,
    };
  }
  return results;
};

const PreviousPageQuery = (results, query, prefix) => {
  const page = ~~query["page"] - 1;
  if (page > 0) {
    return {
      ...results,
      prev: `${prefix}?${qs.stringify(
        {
          ...query,
          page,
        },
        { encode: false }
      )}`,
    };
  }
  return results;
};

// first param is sequelize results array, second param expect koa's ctx
const Paging = (results, { querystring, path: prefix }) => {
  const query = Core(querystring);
  results = NextPageQuery(results, query, prefix);
  results = PreviousPageQuery(results, query, prefix);
  return results;
};

module.exports = {
  QueryProcessor,
  Paging,
};
