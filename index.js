const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const Handlebars = require('handlebars')
const expressHandlebars  = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);


const homeRouter = require('./routers/home');
const coursesRouter = require('./routers/courses');
const addRouter = require('./routers/add');
const basketRouter = require('./routers/basket');
const ordersRouter = require('./routers/orders');
const aouthRouter = require('./routers/aouth');
const varbalse = require('./midleware/varibalse');
const userMidleware = require('./midleware/user');
const keys = require('./keys/');
const error404 = require('./midleware/error404');




const app = express();



app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const store = new MongoStore({
    collection : 'session',
    uri : keys.MONGOBD_URL 
})

// app.use(async(req, res, next)=>{
//     try{
//         const user = await User.findById('6032aeba20bf681870e32e44');
//         req.user = user;
//         next();
//     }catch(e){
//         console.log(e)
//     }
// })

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret : keys.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    store
}))
app.use(csrf());
app.use(flash());
app.use(varbalse);
app.use(userMidleware);

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/basket', basketRouter);
app.use('/orders', ordersRouter);
app.use('/aouth', aouthRouter);

app.use(error404);

const PORT = process.env.PORT || 3000;

async function start(){
    try{
        await mongoose.connect(keys.MONGOBD_URL, {useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false});
        // const candidate = await User.findOne();
        // if(!candidate){
        //     const user = new User({
        //         email: 'derek23@yandex.ru',
        //         name : "derek23",
        //         basket : {items : []}
        //     })
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`server is running in port ${PORT}.....`);
        })

    }catch(e){
        console.log(e);
    }
}

start();



