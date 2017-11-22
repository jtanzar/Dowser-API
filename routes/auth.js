const passport = require('passport')


module.exports = (app) => {

// Our app hits this route when a new user or returning user first logs in, the second parameter is the scope array where we ask for a user's profile and email from google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}), (req, res) => {
  res.send(req.user)
})

// Google re-routes through this route and it returns the user to our app
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('Dowser://login?user=' + JSON.stringify(req.user))
})

// log out
app.get('/auth/logout', (req, res) => {
  req.logout()
  res.send('logged out')
})

// check if anyone is logged in and get details of user
app.get('/auth/current_user', (req, res) => {
  res.send(req.user)
  })

}
