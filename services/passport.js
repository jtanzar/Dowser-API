const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')

// links User object to the mongoose model 'users', see ./models/User.js
const User = mongoose.model('users')

// passport functions for serializing and deserializing (think of JSON parse and stringify for an analogy)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
})

// OAuth with passport is super easy! Start by declaring a new Strategy
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: 'https://dowser-api.herokuapp.com/auth/google/callback'
  },
    async (accessToken, refreshToken, profile, done) => {
// the callback for passport Google Strategy returns your access tokens and the profile data you specify in the scope array, see ./routes/auth.js
      const existingUser =  await User.findOne({ googleID: profile.id })
      //User.findOne is a mongoose call to the mongoDB to check if a user with that google ID already exists
          if (existingUser) {
            done(null, existingUser)
            // if so do nothing since the access token will already be passed back and you don't need to add a new record to the DB and call 'done' with null for error value
          } else {
            // Otherwise create a new User object and save it to the DB
            const user = await new User({
              googleID: profile.id,
              name: profile.displayName,
              firstName: profile.name.givenName,
              email: profile.emails[0].value,
              photo: profile.photos[0].value,
              favorites: []
            }).save()
            // call 'done' with null for error value
            done(null, user)
          }
    }
  )
)
