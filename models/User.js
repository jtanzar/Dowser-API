const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  googleID: String,
  name: String,
  email: String,
  photo: String,
  favorites: Array

})

mongoose.model('users', userSchema)
