const passport = require('passport');
const User= require('../models/user');
const config = require('../config');
const JwtStrategy = require ('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require ('passport-local');

//create local Strategy
const localOprtions ={usernameField: 'email'};
const localLogin = new LocalStrategy( localOprtions, function(email, password, done){
  // verify user/pass call done with user
  // if not call done with false

  User.findOne({ email: email}, function (err, user){
    if(err){return done(err);}
    if(!user){return done(null, false);}

    //compare pw but it has to be compared by hashing the submitted pw and compare it to the saveed pw
    user.comparePassword(password, function(err, isMatch){
      if (err){return done(err);}

      if (!isMatch){ return done(null, false);}

      return done (null, user);

    })

  })
});


// the goal is to see if the user is logged in or not

// setup option for JWT  Strategy tell where to get the extract the token from and also the secret
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
// creating strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // see if the user Id in the payload is in our db
  // if yes call 'done' with the user
  // otherwise call done without a user object
  User.findById(payload.sub, function(err,user){
    if (err){return done (err, false);} // in case search fails

    if (user){
      done(null, user);
    } else {
      done(null, false) // in case user not found
    }
  })
})

// tell passport to use the Strategy
passport.use(jwtLogin);
passport.use(localLogin);
