const { port, graphql } = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const routes = require("./routes");
const graphqlHTTP = require("express-graphql");
const { resolvers } = require("./resolvers");
const { schema } = require("./schema");

const app = express();

app.use(cors());
app.use(express.static("public"));

// Parses json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
//app.use("/", routes);

// graphql
app.use(
  graphql,
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

// listen
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
