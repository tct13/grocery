var express = require('express')
var router = express.Router()
var passport = require('passport')
// var mongoose = require('mongoose')

var Customer = require('../models/customer')
var Product = require('../models/product')
var Cart = require('../models/cart')

// below is the helper function to check that the customer is already logged in on the customer/signup page
function CheckAlreadyLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('signupMessage', 'You have already logged in!')

    console.log(' I am done with CheckAlreadyLoggedIn')

    return res.redirect('/customers/profile')
  } else {
    return next()
  }
}

router.get('/', function (req, res) {
  Customer.find({}, function (err, allCustomers) {
    if (err) throw new Error(err)

    console.log(allCustomers)

    res.render('customers/index', {
      allCustomers: allCustomers
    })
  })
})

router.route('/signup')

    .get(CheckAlreadyLoggedIn, function (req, res) {
      Customer.find({}, function (err, allCustomers) {
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

        // old code for creating a new Customer object before saving into Mongo DB per above newCust.save()
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

router.route('/login')

    .get(function (req, res) {
      res.render('customers/login', { message: req.flash('loginMessage') })
    })

    .post(passport.authenticate('local-login', {
      successRedirect: '/customers/profile',
      failureRedirect: '/customers/signup',
      failureFlash: true
    }))

router.get('/profile', function (req, res) {
    // res.send(req.user.id)
  console.log('I am now showing req.user : ' + req.user)
  res.render('customers/profile', {
    customerData: req.user,
    message: req.flash('loginMessage')
  })
})

router.get('/product', function (req, res) {
  console.log('Shopping now')

  Product.find({}, function (err, allProduct) {
    // console.log('all products are: '+ allProduct.productName)
    // res.send(allProduct)
    res.render('customers/product', {
      allProducts: allProduct
    })
  })
})

router.get('/productpage', function (req, res) {
  // console.log(req.body)
  // console.log(res.params)
  res.render('customers/productpage')
})

router.post('/cart', function (req, res) {
  console.log('yyyy USERRRRRRR ' + req.user.id)

  Cart.find({customerId: req.user.id}).remove().exec()

    // Cart.find( {customerId: req.user.id}, function(err, docs){
    //     if (err) throw new Error(err)
    //     docs.remove()
    //     console.log("Delete all the user's old carts")
    // })

    // FIX THE MULTIPLE CART LOGIC BELOW
    // Cart.findOne( {customerId: req.user.id}, function(err, cart){
    //     if (err) {
    //
    //       console.log('if loop here - there is no cart for this user')
    //       next()
    //     }
    //     else {
    //     // console.log("You already have a cart " + cart.id + " !!!!!!")
    //     // console.log("ZZZZZZZ" + typeof(cart.id))
    //     console.log('else loop - user already have a cart')
    //     res.render('customers/cart')
    //
    //     }
    // })

  console.log('tttttt' + req.body.quantityOrdered)
    // console.log('this is my product id ' + req.body.productId)
    // console.log('this is my req body ' + req.body)

  var productArrayOfObjects = []
  var totalAmount = 0
  var quantityArray = []
  var productIdArray = []
  var unitPriceArray = []

  for (var j = 0; j < req.body.productId.length; j++) {
    console.log(req.body.productId[j])
    productIdArray.push(req.body.productId[j])
    console.log('this is my productIdArrray ' + productIdArray)
    console.log(typeof (productIdArray))

    console.log('rrrrrrrr' + req.body.quantityOrdered[j])
    console.log('sssssss ' + typeof (req.body.quantityOrdered[j]))

    if (req.body.quantityOrdered[j] === '') {
      req.body.quantityOrdered[j] = 0
    }

    quantityArray.push(parseInt(req.body.quantityOrdered[j]))
  }
  console.log('qty array ' + quantityArray)

  for (var i = 0; i < req.body.productId.length; i++) {
    var item = {
      productId: req.body.productId[i],
      quantityOrdered: req.body.quantityOrdered[i]
    }
    productArrayOfObjects.push(item)
  }

  console.log('productArrayOfObjects ' + productArrayOfObjects)

  Product.find({'_id': {'$in': productIdArray} }, function (err, productData) {
    console.log('productData ' + productData)

    productData.forEach(function (productData) {
      console.log('unit price ' + productData.unitPrice)
      unitPriceArray.push(productData.unitPrice)
    })

        // console.log('within datatbase unitPriceArray ' + unitPriceArray)

    for (var i = 0; i < quantityArray.length; i++) {
      totalAmount += (quantityArray[i] * unitPriceArray[i])
    }
        // totalAmount += (productData.unitPrice * quantityArray)
    console.log('1111 total amount now ' + totalAmount)

    var newCart = new Cart({
      totalSpend: totalAmount,
      customerId: req.user.id,
      productOrdered: productArrayOfObjects
    })
    console.log('newCart is ' + newCart)
    newCart.save(function (err, cart) {
      if (err) throw new Error(err)

      Cart.findById(cart.id)
              .populate('productOrdered.productId')
              .exec(function (err, cart) {
                console.log('=========', JSON.stringify(cart))
                res.render('customers/cart', {
                  cartData: cart
                })
              })
    })
  })
})

router.get('/logout', function (req, res) {
  req.logout()
  console.log('Logging customer out')
  res.redirect('/customers/login')
})

router.delete('/delete/:id', function (req, res) {
  Customer.findByIdAndRemove(req.params.id, function (err, customerDelete) {
    if (err) throw new Error(err)

    console.log(req.params.id)

    console.log('Deleting customer account')
    res.redirect('/customers/signup')
  })
})

router.post('/search', function (req, res) {
    console.log('Searching now')

    Product.find({productName: req.body.query}, function (err, foundProduct) {

      console.log('search products are: '+ req.body.query)
      console.log('found products are: '+ foundProduct)

      res.render('customers/searchresults', {
        foundProducts: foundProduct
      })

  })
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
