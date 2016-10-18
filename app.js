var express = require('express')
var app = express()
var port = 5000

var layout = require('express-ejs-layouts')
var customer_routes = require(./routes/customers)

var mongoose = require('mongoose')



console.log('the environment is on ' + process.env.NODE_ENV)

mongoose.Promise = global.Promise
if (process.env.NODE_ENV === 'production'){
  mongoose.connect('mongodb://tct13:Dvdrent1@ds019633.mlab.com:19633/wdi6-brad')
} else {
  mongoose.connect('mongodb://localhost/grocery')
}

app.set('view engine', 'ejs')
app.use(layout)

app.use(express.static(__dirname + 'public'))
app.use('/customers', customer_routes)

app.listen(process.env.PORT || port)
console.log('localhost running on port '+ port)







//


//
//
//
