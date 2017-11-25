const express = require('express');

// This package automatically parses JSON requests.
const bodyParser = require('body-parser');

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

const schema = require('./schema');

var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

// http://localhost:3000/graphiql
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Test GraphQL server running on port ${PORT}.`)
});
