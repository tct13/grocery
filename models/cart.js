var mongoose = require('mongoose')


var Customer = require('./customer')
var Product = require('./product')


var cartSchema = mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    quantityBought: Number,
    totalSpend: Number,
    customer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
})

var Cart = mongoose.model('Cart', receiptSchema)

module.exports = Cart
