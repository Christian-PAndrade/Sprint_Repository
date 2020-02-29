const MongoClient = require("mongodb").MongoClient;
const { db_url, db } = require("./config");

// db variable
let db_instance;

// load the db
const loadDB = async () => {
  // if a db instance already exists, return it
  if (db_instance) return db_instance;

  // if not make new connection
  try {
    const client = await MongoClient.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db_instance = client.db(db);
    console.log("db loaded");
  } catch (err) {
    console.log(err);
  }

  return db_instance;
};

// Add document to collection
const addOne = (db, col1, doc) => db.collection(col1).insertOne(doc);

// Delete all data from collection
const deleteAll = (db, col1) => db.collection(col1).deleteMany({});

// Delete One document from collection
const deleteOne = (db, col, criteria) => db.collection(col).deleteOne(criteria);

// find specific document in collection
const findOne = (db, col, criteria) => db.collection(col).findOne(criteria);

// find all documents from collection
const findAll = (db, col, criteria, projection) =>
  db
    .collection(col)
    .find(criteria)
    .project(projection)
    .toArray();

// find unique values
const findUniqueValues = (db, coll, field) =>
  db.collection(coll).distinct(field);

// Update One document from collection
const updateOne = (db, col, criteria, projec) =>
  db
    .collection(col)
    .findOneAndUpdate(criteria, { $set: projec }, { rawResult: true });

module.exports = {
  loadDB,
  addOne,
  deleteAll,
  deleteOne,
  findOne,
  findAll,
  findUniqueValues,
  updateOne
};
