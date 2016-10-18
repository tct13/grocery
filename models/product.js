var mongoose = require('mongoose')

var productSchema = mongoose.Schema({
    productName: String,
    unitPrice: Number,
})

var Product = mongoose.model('Product', productSchema)

model.exports = Product
