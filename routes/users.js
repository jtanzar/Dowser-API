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
  if (req.user) {
    MongoClient.connect(keys.mongoURI, (err, db) => {
      db.collection('users')
        .find({ googleID: req.user.googleID })
        .toArray((err, docs) => {
          if (docs) {
            res.send(docs[0])
          } else {
            res.send('no user or not logged in')
          }
        })
    })
  } else {
    res.send('please log in')
  }
})

router.get('/favorites', (req, res, next) => {

    MongoClient.connect(keys.mongoURI, (err, db) => {
      db.collection('users')
        .find({ googleID: req.user.googleID })
        .project({ favorites: 1 })
        .toArray((err, docs) => {
          if (docs) {
            res.send(docs[0].favorites)
          } else {
            res.send('favorites error')
          }
        })
    })
  })


router.post('/favorites/add/:id', (req, res, next) => {
  console.log('request to post favorite req.body', req.body)
  console.log('request to post favorite req.user', req.user)

    MongoClient.connect(keys.mongoURI, (err, db) => {
      if (err) throw err
      db.collection('users')
        .update(
          { googleID: req.params.id },
          { $push: {favorites: req.body } }
        )
        .then((err, docs) => {
          if (docs) {
            res.send(docs[0].favorites[favorites.length - 1])
          } else {
            res.send('update error')
          }
        })
    })
  })








module.exports = router
