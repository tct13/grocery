var express = require('express')
var app = express()
var port = 3000

var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)

var mongoose = require('mongoose')
var dotenv = require('dotenv')

var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var layout = require('express-ejs-layouts')


require('./config/passport')(passport)

var customer_routes = require('./routes/customers')

mongoose.Promise = global.Promise
console.log('the environment is on ' + process.env.NODE_ENV)
dotenv.load({ path: '.env.' + process.env.NODE_ENV })
mongoose.connect(process.env.MONGO_URI)
console.log("ENV: ", process.env)

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(layout)
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    autoReconnect: true
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// if (process.env.NODE_ENV === 'production'){
//   mongoose.connect('mongodb://tct13:Dvdrent1@ds019633.mlab.com:19633/wdi6-brad')
// } else {
//   mongoose.connect('mongodb://localhost/grocery')
// }

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))


app.use(function (req, res, next) {
   res.locals.user = req.user
   next()
})


app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))



app.use('/customers', customer_routes)

app.listen(process.env.PORT || port)
console.log('localhost running on port ' + port)
