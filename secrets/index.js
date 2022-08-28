require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "shhh",
  NODE_ENV: process.env.NODE_ENV || "development",
}