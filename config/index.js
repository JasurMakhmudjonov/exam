require("dotenv");

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  databaseUrl: process.env.DATABASE_URL,
};

module.exports = config;
