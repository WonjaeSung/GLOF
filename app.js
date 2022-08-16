const path = require('path')
const express = require('express')
const dotenv = require ("dotenv")
const morgan = require ('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// Load config
dotenv.config ({path: "./config/config.env" })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Logging
if(process.env.NODE_ENV === 'development'){
    //! morgan is for logging. Morgan only runs when in dev
    app.use(morgan('dev'))
};

//Handlebars Helpers
const {formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

//Handlebars
//!Add the word .engine after exphbs
app.engine('.hbs', 
exphbs.engine({  
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

//sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        //cookie: {secure: true}
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Set global variable
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

//static folder, __dirname is saying look into local storage that the current file is in.
app.use(express.static(path.join(__dirname, "public")))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 