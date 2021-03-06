if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
console.log(process.env.CLOUD_NAME)

const express = require('express');
const app = express();

const expressError = require('./utils/ExpressErrors');
const contentRoutes = require('./routes/content');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const config = require('./config/config');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.DB_SECRET || 'C+-jsgg6';
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sharenet';;
// || 'mongodb://localhost:27017/sharenet';
// const secret = process.env.SECRET || 'secret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function(e) {
    console.log('session store error', e)
}) 

const sessionConfig = {
    store,
    name:'session',
    // mongoUrl: dbUrl,
    secret,
    resave: false,
    saveUninitialized:true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/', userRoutes)
app.use('/content', contentRoutes)
app.use('/content/:id/review', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req,res,next)=>{
    next(new expressError('Page dont found', 404))
})

app.use((err, req, res, next) => {

    if(err){
        req.flash('error', 'That post doesnt exist')
        return res.redirect('/content')
    } 
    const {statusCode = 500} = err
    if(!err.message) err.message = "Error detected"
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('working!')
})