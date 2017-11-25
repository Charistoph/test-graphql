// simple resolver that returns the fixed contents of a local array.

const links = [
  {
    id: 1,
    url: 'http://graphql.org/',
    description: 'The Best Query Language'
  },
  {
    id: 2,
    url: 'http://dev.apollodata.com',
    description: 'Awesome GraphQL Client'
  },
];

module.exports = {
  Query: {
    allLinks: () => links,
  },
  Mutation: {
    createLink: (_, data) => {
      const newLink = Object.assign({id: links.length + 1}, data);
      links.push(newLink);
      return newLink;
    }
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
