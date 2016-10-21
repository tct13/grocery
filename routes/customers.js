var express = require('express')
var router = express.Router()

var Customer = require('../models/customer')

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

    .get( function (req, res) {
        res.render('customers/signup')
    })

    .post( function(req, res) {

        var newCust = new Customer (req.body.newCustomer)
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

        console.log('SSSSSSSSSS: ' + newCust)

        newCust.save(function (err) {
            if (err) throw new Error(err)
        })
        res.redirect('/customers/login')
    })


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
        res.render('customers/login')
    })

    .post( function(req, res) {
        var cust = req.body.customer
        console.log (cust)

        Customer.findOne({ 'local.email': cust.local.email }, function (err, foundUser) {
          if (err) res.send(err.message)

          console.log('ooooooo'+ foundUser)

          if (foundUser) {
            foundUser.authenticate( cust.local.password, function (err, authenticated ) {
              if (err) res.send(err)

              if (authenticated) {
                res.redirect('/customers/profile')
              } else {
                res.redirect('/customers/error')
              }
            })
          } else {
            res.redirect('/customers/login')
          }
        })
    })







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
