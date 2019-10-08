module.exports = {
  DB: {
    REDIS: {
      host: "redis-service",
      port: 6379,
      password: "",
      db: 0,
    },
    MYSQL: {
      username: "root",
      password: "admin",
      database: "voting_system",
      host: "mysql-service",
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
