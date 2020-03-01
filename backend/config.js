const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  db_url: process.env.DBURL,
  db: process.env.DB,
  port: process.env.PORT,
  graphql: process.env.GRAPHQLURL
};
