//modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const {MongoClient} = require('mongodb');
const{getCollection} = require('./models/event');
const mongoose  = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')

//app
const app = express();

//config app
let port  = 8084
let host = 'localhost'
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/NBAD',
                {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
.then(()=>{
    app.listen(port,host,()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));
//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({
    secret:'klfenfiehiffeo',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://127.0.0.1:27017/NBAD'})
}));

app.use(flash());

app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.user = req.session.user;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');

    next();
});

//routes

app.use('/',mainRoutes);

app.use('/connections',eventRoutes);

app.use('/users',userRoutes)

app.use((req,res,next)=>{
    let err=new Error('The server cannot locate' +req.url);
    err.status = 404;
    next(err);
})

app.use((err,req,res,next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server error");
    }
    res.status(err.status);
    res.render('error',{error: err});
})

