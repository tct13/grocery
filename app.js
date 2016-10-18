var express = require('express')
var app = express()
var port = 5000

var layout = require('express-ejs-layouts')
var customer_routes = require(./routes/customers)

app.use(layout)
app.use('/customers', customer_routes)

app.set('view engine', 'ejs')


app.listen(process.env.PORT || port)
console.log('localhost running on port '+ port)







// app.use(express.static(__dirname + 'public'))


// var mongoose = require('mongoose')
// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost/grocery')
