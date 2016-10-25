var express = require('express')
var router = express.Router()
var passport = require('passport')
var Customer = require('../models/customer')


// below is the helper function to check that the customer is already logged in on the customer/signup page
function CheckAlreadyLoggedIn (req, res, next) {

  if ( req.isAuthenticated() ) {
    req.flash('signupMessage', 'You have already logged in!')

    console.log(" I am done with CheckAlreadyLoggedIn")

    return res.redirect('/customers/profile')
  } else {
    return next()
  }
}


router.get('/', function(req, res) {
    Customer.find( {}, function (err, allCustomers ) {
        if (err) throw new Error(err)

        console.log(allCustomers)

        res.render('customers/index', {
            allCustomers: allCustomers
        })
    })
})


router.route('/signup')

    .get( CheckAlreadyLoggedIn, function (req, res) {
      Customer.find( {}, function (err, allCustomers ) {
        res.render('customers/signup', {
          allCustomers: allCustomers,
          message: req.flash('signupMessage')
        })
      })
    })

    .post(passport.authenticate('local-signup', {
      successRedirect: '/customers/profile',
      failureRedirect: '/customers/signup',
      failureFlash: true
    }))



    // .post( function(req, res) {
    //
    //   var newCust = new Customer (req.body.newCustomer)
    //   console.log('SSSSSSSSSS: ' + newCust)
    //
    //   newCust.save(function (err) {
    //       if (err) throw new Error(err)
    //   })
    //   res.redirect('/customers/login')

        //old code for creating a new Customer object before saving into Mongo DB per above newCust.save()
        // var newCust = new Customer({
        //     name: req.body.newCustomer.name,
        //     local: {
        //         email: req.body.newCustomer.local.email,
        //         password: req.body.newCustomer.local.password,
        //     },
        //     billingAddress: req.body.newCustomer.billAddr,
        //     deliveryAddress: req.body.newCustomer.deliAddr,
        //     phoneNumber: req.body.newCustomer.phone,
        // })
    // })


// router.get('/signup', function (req, res) {
//   res.render('customers/signup')
// })

// router.post('/signup', function(req, res) {
//     var newCust = new Customer (req.body.newCustomer)
//     // var newCust = new Customer({
//     //     name: req.body.newCustomer.name,
//     //     local: {
//     //         email: req.body.newCustomer.local.email,
//     //         password: req.body.newCustomer.local.password,
//     //     },
//     //     billingAddress: req.body.newCustomer.billAddr,
//     //     deliveryAddress: req.body.newCustomer.deliAddr,
//     //     phoneNumber: req.body.newCustomer.phone,
//     // })
//
//     console.log('SSSSSSSSSS: ' + newCust)
//     newCust.save(function (err) {
//         if (err) throw new Error(err)
//     })
//     res.redirect('/customers/login')
// })


router.route ('/login')

    .get ( function (req, res) {
        res.render( 'customers/login', { message: req.flash('loginMessage') } )
    })

    .post(passport.authenticate('local-login', {
      successRedirect: '/customers/profile',
      failureRedirect: '/customers/login',
      failureFlash: true
    }))


router.get('/profile', function (req, res) {
    // res.send(req.user.id)
    console.log('I am now showing req.body : ' + req.user)
    res.render('customers/profile', { message: req.flash('loginMessage') })
})


router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/customers/login')
})


router.get('/error', function (req, res) {
    res.render('customers/error')
})



    // .post( function(req, res) {
    //     var cust = req.body.customer
    //     console.log (cust)
    //
    //     Customer.findOne({ 'local.email': cust.local.email }, function (err, foundUser) {
    //       if (err) res.send(err.message)
    //
    //       console.log('ooooooo'+ foundUser)
    //
    //       if (foundUser) {
    //         foundUser.authenticate( cust.local.password, function (err, authenticated ) {
    //           if (err) res.send(err)
    //
    //           if (authenticated) {
    //             res.redirect('/customers/profile')
    //           } else {
    //             res.redirect('/customers/error')
    //           }
    //         })
    //       } else {
    //         res.redirect('/customers/login')
    //       }
    //     })
    // })


// router.get('/login', function (req, res) {
//   res.render('customers/login')
// })
//
// router.post('/login', function(req, res) {
//     var cust = req.body.customer
//     console.log (cust)
//
//     Customer.findOne({ 'local.email': cust.local.email }, function (err, foundUser) {
//       if (err) res.send(err.message)
//
//       console.log('ooooooo'+ foundUser)
//
//       if (foundUser) {
//         foundUser.authenticate( cust.local.password, function (err, authenticated ) {
//           if (err) res.send(err)
//
//           if (authenticated) {
//             res.redirect('/customers/profile')
//           } else {
//             res.redirect('/customers/error')
//           }
//         })
//       } else {
//         res.redirect('/customers/login')
//       }
//     })
// })


module.exports = router
