var mongoose = require('mongoose')

var customerSchema = mongoose.Schema({
    cusomterId = String,
    name: {
        firstName: String,
        lastName: String,
    },
    email: String,
    address: {
        number: Number,
        street: String,
        postcode: String,
    },
})

var Customer = mongoose.model('Customer', customerSchema)

model.exports = Customer
