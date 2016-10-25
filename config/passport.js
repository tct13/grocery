var LocalStrategy = require('passport-local').Strategy
var Customer = require('../models/customer')

module.exports = function (passport) {
  passport.serializeUser(function (customer, done) {
    done(null, customer.id)
  })

  passport.deserializeUser(function (id, done) {
    Customer.findById(id, function (err, customer) {
      done(err, customer)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'newCustomer[local][email]',
    passwordField: 'newCustomer[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    // the authentication flow on our local auth routes

    process.nextTick(function () {
      Customer.findOne({'local.email': email }, function (err, foundUser) {
        // if user is found, dont create new user
        // if user is not found, create new user

        if (err) return next(err)

        if (foundUser) {

          console.log("I am now in FOUNDERUSER!")

          return next(null, false, req.flash('signupMessage', 'Email taken!'))
        } else {

          console.log("I am now going to CREATE MY CUSTOMER!")

          Customer.create(req.body.newCustomer, function (err, newCust) {
            if (err) throw err
            return next(null, newCust)
          })
        }
      })
    })
  }))



  passport.use('local-login', new LocalStrategy({
    usernameField: 'customer[local][email]',
    passwordField: 'customer[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {

    console.log('Authenticating email and password entered')
    console.log(email, password)

    Customer.findOne({ 'local.email': email }, function (err, foundUser) {
      if (err) return next(err)

      // if cannot find use by email, return to route with flash message
      if (!foundUser)
        return next(null, false, req.flash('loginMessage', 'No user found with this email'))

      foundUser.auth(password, function (err, authenticated) {
        if (err) return next(err)

        if (authenticated) {
          return next(null, foundUser, req.flash('loginMessage', 'Hello logged in user ' + foundUser.local.email))
        } else {
          return next(null, false, req.flash('loginMessage', 'Wrong password!'))
        }
      })
    })
  }))
}
