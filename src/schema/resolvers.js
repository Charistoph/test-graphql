// simple resolver that returns the fixed contents of a mongodb database.

module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { // 1 The context object you’ve specified in that call to graphqlExpress is the third argument passed down to each resolver.
      return await Links.find({}).toArray(); // 2 For the allLinks query all you need is to call MongoDB’s find function in the Links collection, and then turn the results into an array.
    },
  },

  Mutation: {
    createLink: async (root, data, {mongo: {Links}, user}) => {
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
  },

  Link: {
    id: root => root._id || root.id, // 5 MongoDB will automatically generate ids for you, which is great! Unfortunately, it calls them _id, while your schema calls them id.
  },

  User: {
    // Convert the "_id" field from MongoDB to "id" from the schema.
    id: root => root._id || root.id,
  },
};
