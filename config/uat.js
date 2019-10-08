const IS_PROD = true;
const IS_DEV = true;

module.exports = {
  PORT: 3000,
  IS_PROD,
  IS_DEV,
  DB: {
    REDIS: {
      host: "localhost",
      port: 6379,
      password: "",
      db: 0,
    },
    MYSQL: {
      username: "root",
      password: "admin",
      database: "voting_system",
      host: "localhost",
      dialect: "mysql",
      logging: false,
      force_sync: false,
      timezone: "+08:00",
      define: {
        underscored: true,
        underscoredAll: true,
        timestamps: false,
        freezeTableName: false,
      },
    },
  },
};
