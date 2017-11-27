// The facebook libary Dataloader is very useful for avoiding unnecessary multiple requests to services like MongoDB. To achieve that, it not only covers caching, but also batching requests.

const DataLoader = require('dataloader');

// 1 batch function to be called when it has multiple items to fetch together. This loader will be used for user data, and the keys are going to be user ids. So the batch function just needs to make a single call to MongoDB with all the given ids.
async function batchUsers (Users, keys) {
  return await Users.find({_id: {$in: keys}}).toArray();
}

// 2 data loaders are not supposed to be reused between different GraphQL requests. This file will return a function for creating the data loaders, that will later be called for each request.
module.exports = ({Users}) =>({
  // 3 create the user data loader
  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    {cacheKeyFn: key => key.toString()}, // cacheKeyFn: allows you to normalize keys so that they may be compared correctly for caching purposes
//    {if (key != 'undefined') {
//      cacheKeyFn: key => key.toString()}, // cacheKeyFn: allows you to normalize keys so that they may be compared correctly for caching purposes
//    }
//    console.log(key),
  ),
});
