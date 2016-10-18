var mongoose = require('mongoose')

var receiptSchema = mongoose.Schema({
    receiptNumber: Number,
    date: Date,
    totalAmount: Number,
})

var Receipt = mongoose.model('Receipt', receiptSchema)

model.exports = Receipt
