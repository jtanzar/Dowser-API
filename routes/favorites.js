const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// mongoogse is used to give schema-like predictability to a no-schema DB like mongo (see ./models/User.js)
const keys = require('../config/keys')
const MongoClient = require('mongodb').MongoClient
// MongoClient is called on the mongoDB asset allowing the use of the MongoClient.connect command


// get a user's favorites
router.get('/show/:id', (req, res, next) => {
// this command connects to the database and returns the DB object upon successful connection
    MongoClient.connect(keys.mongoURI, (err, db) => {
// call 'collection' on the db object to access that specific collection
      db.collection('users')
      // find user whose google ID matches the ID from the request
        .find({ googleID: req.params.id })
        // tell mongoDB what to return
        .project({ favorites: 1 })
        // put the document we queried in an array
        .toArray((err, docs) => {
          if (docs) {
            res.send(docs[0].favorites)
          } else {
            res.send('favorites error')
          }
        })
    })
})

// add a new favorite place
router.post('/add/:id', (req, res, next) => {

    MongoClient.connect(keys.mongoURI, (err, db) => {

      db.collection('users')
        .update(
          { googleID: req.params.id },
          { $push: {favorites: req.body } }
        )

      db.collection('users')
        .find({ googleID: req.params.id })
        .project({ favorites: 1 })
        .toArray((err, docs) => {
          res.send(docs[0].favorites)
        })
    })
})


// DELETE A FAVORITE IN MAINTAINENCE MODE
// router.delete('/delete/:id', (req, res, next) => {
//
//     MongoClient.connect(keys.mongoURI, (err, db) => {
//
//       db.collection('users')
//         .update(
//           { googleID: req.params.id },
//           { $pull: { "favorites.venueId" : req.body.venueId } },
//         )
//
//       db.collection('users')
//         .find({ googleID: req.params.id })
//         .project({ favorites: 1 })
//         .toArray((err, docs) => {
//           res.send(docs[0].favorites)
//         })
//      })
// })








module.exports = router
