const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const keys = require('../config/keys')
// const User = mongoose.model('users')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')



const insertDocuments = (db, callback) => {
  // Get the documents collection
  const collection = db.collection('users')
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], (err, result) => {
    assert.equal(err, null)
    assert.equal(3, result.result.n)
    assert.equal(3, result.ops.length)
    console.log("Inserted 3 documents into the collection")
    callback(result)
  })
}

const findDocuments = function(db, callback) {
  const collection = db.collection('users')
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null)
    console.log("Found the following records")
    console.log(docs)
    callback(docs)
  })
}

// const findDocument = function(db, callback) {
//   const collection = db.collection('users')
//   collection.find({googleID: '105684873485563996850'}).toArray(function(err, docs) {
//     assert.equal(err, null)
//     console.log("Found the following record")
//     console.log(docs)
//     callback(docs)
//   })
// }

router.get('/', (req, res, next) => {
  MongoClient.connect(keys.mongoURI, (err, db) => {
    db.collection('users')
      .find({ googleID: req.user.googleID })
      .toArray((err, docs) => {
        res.send(docs[0])
      })
  })
})

router.get('/favorites', (req, res, next) => {
  MongoClient.connect(keys.mongoURI, (err, db) => {
    db.collection('users')
      .find({ googleID: req.user.googleID })
      .project({ favorites: 1 })
      .toArray((err, docs) => {
        res.send(docs[0].favorites)
      })
  })
})


router.get('/favorites/add', (req, res, next) => {
  MongoClient.connect(keys.mongoURI, (err, db) => {
    db.collection('users')
      .update(
        { googleID: req.user.googleID },
        { $push: {favorites: ['89'] } }
      )
  })
})








module.exports = router
