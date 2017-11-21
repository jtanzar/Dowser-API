const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const keys = require('../config/keys')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


router.get('/show/:id', (req, res, next) => {

    MongoClient.connect(keys.mongoURI, (err, db) => {

      db.collection('users')
        .find({ googleID: req.params.id })
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








module.exports = router
