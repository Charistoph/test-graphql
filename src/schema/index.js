const {makeExecutableSchema} = require('graphql-tools');

// Define your types here.
const typeDefs = `
  type Link {
    id: ID!
    url: String!
    description: String!
  }
`;

// Generate the schema object from your types definition.
// makeExecutableSchema is a graphql-tools package
// takes a string in the schema definition language and returns a
// complete GraphQLSchema object to be used by your server.
module.exports = makeExecutableSchema({typeDefs});
