const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `
  type Link {
    id: ID!
    url: String!
    description: String!
  }

  type Query {
    allLinks: [Link!]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
  }
`;

// Generate the schema object from your types definition.
// makeExecutableSchema is a graphql-tools package
// takes a string in the schema definition language and returns a
// complete GraphQLSchema object to be used by your server.
//module.exports = makeExecutableSchema({typeDefs});

// Now you just have to pass these resolvers when building the
// schema object with makeExecutableSchema:
module.exports = makeExecutableSchema({typeDefs, resolvers});
