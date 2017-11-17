const passport = require('passport')


module.exports = (app) => {

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}), (req, res) => {
  console.log('res 1', res.headers)
  // console.log('req', req.headers)
  res.send(req.user)
})

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log('res 2', res.headers)
  // console.log('req', req.headers.cookie)
  res.send(req.user)
})

app.get('/auth/logout', (req, res) => {
  req.logout()
  res.send('logged out')
})

app.get('/auth/current_user', (req, res) => {
  res.send(req.user)
  })

}
