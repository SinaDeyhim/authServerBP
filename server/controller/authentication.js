const User = require ('../models/user');
const jwt = require ('jwt-simple');
const config = require ('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat:timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  // done callbaack assigns the user to req.user
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next){
  // fetching data our of post requests

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  User.findOne({ email: email }, function(err, existingUser){
    // db error
    if(err){ return next(err);}

    // see if the user already exists return err
    if (existingUser){
      return res.status(422).send({ error: 'Email aleady exists' });
    }

    // else create and save user error and respond to the request
    const user = new User({
      email: email,
      password:password,
    });

    // save the user in the db
    user.save(function(err){
      if (err){return next(err);}
      // respond and send token
      res.json({ token: tokenForUser(user)});
    });
  });
}
