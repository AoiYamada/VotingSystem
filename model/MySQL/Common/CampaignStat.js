const CustomModel = require("../CustomModel");

module.exports = class CampaignStat extends CustomModel {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        title: { type: DataTypes.STRING, allowNull: false },
        total_votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        start_time: { type: DataTypes.DATE },
        end_time: { type: DataTypes.DATE },
        options: { type: DataTypes.TEXT, allowNull: false, defaultValue: "{}" },
      },
      {
        sequelize,
        hooks: {
          beforeValidate: obj => {
            if (obj.options) {
              switch (typeof obj.options) {
                case "object":
                  obj.options = JSON.stringify(obj.options);
                  break;
                case "string":
                  try {
                    JSON.parse(obj.options)
                  } catch (_) {
                    obj.options = "{}";
                  }
                  break;
                default:
                  obj.options = "{}";
              }
            }
          },
          afterFind: results => {
            if (!results) return results;
            if (results.constructor === Array) {
              for (const result of results) {
                if (result.options) {
                  result.options = JSON.parse(result.options);
                }
              }
            } else if (results && results.constructor !== Array) {
              results.options = JSON.parse(results.options);
            }
            return results;
          },
        },
      }
    );
  }
};
