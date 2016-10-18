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







module.exports = router
