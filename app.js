const path = require('path')
const express = require('express')
const dotenv = require ("dotenv")
const morgan = require ('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

// Load config
dotenv.config ({path: "./config/config.env" })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if(process.env.NODE_ENV === 'development'){
    //! morgan is for logging. Morgan only runs when in dev
    app.use(morgan('dev'))
};

//Handlebars
//!Add the word .engine after exphbs
app.engine('.hbs', exphbs.engine
    ({
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
    })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder, __dirname is saying look into local storage that the current file is in.
app.use(express.static(path.join(__dirname, "public")))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 