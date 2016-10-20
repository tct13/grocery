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


router.get('/new_customer_signup', function (req, res) {
  res.render('customers/new_customer_signup')
})


router.post('/new_customer_signup', function(req, res) {

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

    // console.log(req.body)
    console.log(newCust)

    newCust.save(function (err) {
        if (err) throw new Error(err)
    })
    res.redirect('/customers/login')
})


router.get('/login', function (req, res) {
  res.render('customers/customer_login')
})




//login post here









module.exports = router
