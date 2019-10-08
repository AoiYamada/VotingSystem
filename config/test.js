module.exports = {
  PORT: 8000,
  DB: {
    REDIS: {
      host: "localhost",
      port: 6379,
      password: "",
      db: 1,
    },
    MYSQL: {
      username: "root",
      password: "admin",
      database: "voting_system_test",
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
