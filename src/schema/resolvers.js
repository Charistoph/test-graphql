// simple resolver that returns the fixed contents of a mongodb database.

module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { // 1 The context object you’ve specified in that call to graphqlExpress is the third argument passed down to each resolver.
      return await Links.find({}).toArray(); // 2 For the allLinks query all you need is to call MongoDB’s find function in the Links collection, and then turn the results into an array.
    },
  },

  Mutation: {
    createLink: async (root, data, {mongo: {Links}}) => {
      const response = await Links.insert(data); // 3 For the createLink mutation you save the data via Links.insert.
      return Object.assign({id: response.insertedIds[0]}, data); // 4 Still inside createLink, use insertedIds from MongoDB to return the final Link object from the resolver.
    },
  },

  Link: {
    id: root => root._id || root.id, // 5 MongoDB will automatically generate ids for you, which is great! Unfortunately, it calls them _id, while your schema calls them id.
  },
};

// Test with
//{
//  allLinks {
//    id
//    url
//    description
//  }
//}
//

//mutation {
//  createLink(
//    url: "https://www.howtographql.com/graphql-js/3-mutations/",
//    description: "Very amaze!",
//  ) {
//    id
//    url
//    description
//  }
//}
//
