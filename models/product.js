var mongoose = require('mongoose')

var productSchema = mongoose.Schema({
    productName: String,
    unitPrice: Number,
    stockQuantity: Number,
})

var Product = mongoose.model('Product', productSchema)


// dummy data below for testing!!!!!!!
// how to use Customer.create(req.body.newCustomer)?

var newP1 = new Product({
    productName: 'Leek',
    unitPrice: 1,
    stockQuantity: 50,
})

var newP2 = new Product({
    productName: 'Egg',
    unitPrice: 1.5,
    stockQuantity: 75,
})

var newP3 = new Product({
    productName: 'Bread',
    unitPrice: 2,
    stockQuantity: 100,
})

newP1.save(function (err) {
  if (err) console.log(err.message)
  // console.log('new user saved')
})

newP2.save(function (err) {
  if (err) console.log(err.message)
  // console.log('new user saved')
})

newP3.save(function (err) {
  if (err) console.log(err.message)
  // console.log('new user saved')
})



module.exports = Product
