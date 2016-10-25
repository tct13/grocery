var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var customerSchema = mongoose.Schema({
    name: String,
    local: {

        email: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },

    },
    billingAddress: String,
    deliveryAddress: String,
    phoneNumber: Number,
})

mongoose.Promise = global.Promise

customerSchema.pre('save', function (next) {

  var thisCustomer = this
  console.log('before save ' + this)

  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(thisCustomer.local.password, salt, function (err, hash) {
      if (err) return next(err)

      thisCustomer.local.password = hash
      console.log('after hash ' + thisCustomer)
      next()
    })
  })
})

customerSchema.post('save', function () {
  console.log('hash save successful')
})


customerSchema.methods.auth = function( loginPassword, callback ) {

    console.log('given password is ' + loginPassword)
    console.log('saved password is ' + this.local.password)

    bcrypt.compare( loginPassword, this.local.password, function (err, isMatch) {
      callback(err, isMatch)
    })
}


var Customer = mongoose.model('Customer', customerSchema)


// dummy data below for testing!!!!!!!
// var newC = new Customer(
//   {
//
//     name: 'assssss',
//     local: {
//       email: 'xxx@gmail.com',
//       password: 'test123',
//     },
//     billingAddress: '1 street',
//     deliveryAddress: '2 street',
//     phoneNumber: 123456,
//
//   }
// )
//
// newC.save(function (err) {
//   if (err) console.log(err.message)
//   // console.log('new user saved')
// })


module.exports = Customer
