//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://0.0.0.0:27017/test';
var url = 'mongodb://0.0.0.0:27017/test';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.

  insertDocuments(db, function() {
   findDocuments(db, function() {
    db.close();
   })
  });
  }
});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    
    
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}