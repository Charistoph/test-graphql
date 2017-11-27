const express = require('express');

// This package automatically parses JSON requests.
const bodyParser = require('body-parser');

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const schema = require('./schema');

const {authenticate} = require('./authentication');
// add dataloaders

//const buildDataloaders = require('./dataloaders');

// format error handler
const formatError = require('./formatError');

// 1 add mongo connector
const connectMongo = require('./mongo-connector');

// 2 Wrap the whole app setup code with an async function. That’s just so you can use async/await syntax, now that there’s an asynchronous step.
const start = async () => {
  // 3
  // Call the MongoDB connect function and wait for it to finish.
  const mongo = await connectMongo();
  var app = express();

  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
//      dataloaders: buildDataloaders(mongo), // the resolvers need to use this new data loader instead of MongoDB when fetching users
      context: {
        mongo,
        user
      }, // This context object is passed to all resolvers.
      formatError,
      schema,
    };
  };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  app.use('/graphql', bodyParser.json(), graphqlExpress({
    context: {mongo}, // 4 Put the MongoDB collections into the context object. This is a special GraphQL object that gets passed to all resolvers, so it’s the perfect place to share code (such as connectors like this) between them.
    schema
  }));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-foo@bar.com'`,
  }));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });
};

// 5
start();

var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

// http://localhost:3000/graphiql
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
