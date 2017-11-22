const mongoose = require('mongoose')
const { Schema } = mongoose

// this is a mongoose Schema, which allows schema-like structuring of mongoDB data without restricting flexibility
const userSchema = new Schema({
  googleID: String,
  name: String,
  email: String,
  photo: String,
  favorites: Array

})

// link the model 'users' to mongoose
mongoose.model('users', userSchema)
