var mongoose = require('mongoose')

var Customer = require('./customer')
var Product = require('./product')


var cartSchema = mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    totalSpend: Number,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },

    productOrdered: [{

          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantityOrdered: Number,
    }]

})

var Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
