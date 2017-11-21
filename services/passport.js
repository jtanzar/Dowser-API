const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
})

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: 'https://dowser-api.herokuapp.com/auth/google/callback'
  },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      const existingUser =  await User.findOne({ googleID: profile.id })
          if (existingUser) {
            done(null, existingUser)
          } else {
            const user = await new User({
              googleID: profile.id,
              name: profile.displayName,
              firstName: profile.name.givenName,
              email: profile.emails[0].value,
              photo: profile.photos[0].value,
              favorites: []
            }).save()
          }
    }
  )
)
