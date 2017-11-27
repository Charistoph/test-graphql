// simple resolver that returns the fixed contents of a mongodb database.
var ObjectId = require('mongodb').ObjectID;

const {URL} = require('url');

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

function assertValidLink ({url}) {
  try {
    new URL(url);
  } catch (error) {
    throw new ValidationError('Link validation error: invalid url.', 'url');
  }
}

module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { // 1 The context object you’ve specified in that call to graphqlExpress is the third argument passed down to each resolver.
      return await Links.find({}).toArray(); // 2 For the allLinks query all you need is to call MongoDB’s find function in the Links collection, and then turn the results into an array.
    },

    allUsers: async (root, data, {mongo: {Users}}) => {
      return await Users.find({}).toArray();
    },

    allVotes: async (root, data, {mongo: {Votes}}) => {
      return await Votes.find({}).toArray();
    },
  },

  Mutation: {
    createLink: async (root, data, {mongo: {Links}, user}) => {
        assertValidLink(data);
        const newLink = Object.assign({postedById: user && user._id}, data)
        const response = await Links.insert(newLink);
        return Object.assign({id: response.insertedIds[0]}, newLink);
    },

    createUser: async (root, data, {mongo: {Users}}) => {
      // You need to convert the given arguments into the format for the
      // `User` type, grabbing email and password from the "authProvider".
      const newUser = {
          name: data.name,
          email: data.authProvider.email.email,
          password: data.authProvider.email.password,
      };
      const response = await Users.insert(newUser);
      return Object.assign({id: response.insertedIds[0]}, newUser);
    },

    signinUser: async (root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.email.email});
      if (data.email.password === user.password) {
        return {token: `token-${user.email}`, user};
      }
    },

    createVote: async (root, data, {mongo: {Votes}, user}) => {
      const newVote = {
        userId: user && user._id,
        linkId: new ObjectId(data.linkId),
      };
      const response = await Votes.insert(newVote);
      return Object.assign({id: response.insertedIds[0]}, newVote);
    },
  },

  User: {
    // Convert the "_id" field from MongoDB to "id" from the schema.
    id: root => root._id || root.id,

    votes: async ({_id}, data, {mongo: {Votes}}) => {
      return await Votes.find({userId: _id}).toArray();
    },
  },

  Link: {
    id: root => root._id || root.id, // 5 MongoDB will automatically generate ids for you, which is great! Unfortunately, it calls them _id, while your schema calls them id.

    postedBy: async ({postedById}, data, {mongo: {Users}}) => {
        return await Users.findOne({_id: postedById});
    },

    votes: async ({_id}, data, {mongo: {Votes}}) => {
      return await Votes.find({linkId: _id}).toArray();
    },

    // add user dataloader to increase performance
    postedBy: async ({postedById}, data, {dataloaders: {userLoader}}) => {
      if (postedById != undefined) {
        return await userLoader.load(postedById);
      }
    },
  },

  Vote: {
    id: root => root._id || root.id,

    user: async ({userId}, data, {mongo: {Users}}) => {
      return await Users.findOne({_id: userId});
    },

    link: async ({linkId}, data, {mongo: {Links}}) => {
      return await Links.findOne({_id: linkId});
    },

    // add user dataloader to increase performance
    user: async ({userId}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load(userId);
    },
  },
};
