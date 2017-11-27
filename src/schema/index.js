const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `
  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }

  type User {
    id: ID!
    name: String!
    email: String
    votes: [Vote!]!
  }

  type SigninPayload {
      token: String
      user: User
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  type Query {
    allLinks: [Link!]!
    allUsers: [User!]!
    allVotes: [Vote!]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
    createVote(linkId: ID!): Vote
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  }

  input AuthProviderSignupData {
      email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
      email: String!
      password: String!
  }
  
  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }

  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  type Subscription {
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
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
