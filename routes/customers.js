var express = require('express')
var router = express.Router()
var passport = require('passport')
// var mongoose = require('mongoose')

var Customer = require('../models/customer')
var Product = require('../models/product')
var Cart = require('../models/cart')





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
    console.log('I am now showing req.user : ' + req.user)
    res.render('customers/profile', {
      customerData: req.user,
      message: req.flash('loginMessage'),
    })
})

router.get('/product', function (req, res) {
    console.log('Shopping now')

    Product.find( {}, function (err, allProduct ) {

      // console.log('all products are: '+ allProduct.productName)

      res.render('customers/product', {
        allProducts: allProduct,
      })
    })
})

router.get('/productPage', function (req, res) {
  // console.log(req.body)
  // console.log(res.params)
  res.render('customers/productPage')
})


router.post('/cart', function(req, res) {

    console.log('yyyy ' + req.user.id)
    console.log('tttttt' + req.body.productId + req.body.quantityOrdered)
    // console.log('qqqqq ' + typeof(req.body.productOrdered) + ' '+ typeof (req.body))
    // console.log('this is my req body ' + req.body)

    var productArrayOfObjects = []
    var totalAmount = 0

    for (var i=0; i<req.body.productId.length; i++) {
      var item = {
        productId: req.body.productId[i],
        quantityOrdered: req.body.quantityOrdered[i]
      }
      productArrayOfObjects.push(item);
    }

    console.log(productArrayOfObjects)

    // Product.findById(req.body.productId,)





    var newCart = new Cart ({

        // totalSpend:
        customerId: req.user.id,
        // productId: []
        productOrdered: productArrayOfObjects
    })
    // newCart.productId.push(req.body)

    console.log('newCart is ' + newCart)
    newCart.save(function (err) {
            if (err) throw new Error(err)
    })

  })






router.get('/logout', function (req, res) {
    req.logout()
    console.log('Logging customer out')
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
