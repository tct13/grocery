var express = require('express')
var app = express()
var port = 4000

var customer_routes = require('./routes/customers')

var mongoose = require('mongoose')
var dotenv = require('dotenv')

var bodyParser = require('body-parser')
var layout = require('express-ejs-layouts')

mongoose.Promise = global.Promise
console.log('the environment is on ' + process.env.NODE_ENV)
dotenv.load({ path: '.env.' + process.env.NODE_ENV })
mongoose.connect(process.env.MONGO_URI)


// if (process.env.NODE_ENV === 'production'){
//   mongoose.connect('mongodb://tct13:Dvdrent1@ds019633.mlab.com:19633/wdi6-brad')
// } else {
//   mongoose.connect('mongodb://localhost/grocery')
// }

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(layout)
app.use(express.static(__dirname + 'public'))

app.use('/customers', customer_routes)

app.listen(process.env.PORT || port)
console.log('localhost running on port ' + port)
