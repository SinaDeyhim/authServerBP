const Authentication = require('./controller/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// an object to intercept requests before they hit the route handler
// authenticate users using the jwt strategy
const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false});


module.exports = function (app) {
  app.get('/',requireAuth, function(req, res){
    res.send({ hi: 'there'})
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
