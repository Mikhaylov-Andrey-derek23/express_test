const express = require('express');
const path = require('path');
const Handlebars = require('handlebars')
const expressHandlebars  = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');

const User = require('./models/user');
const homeRouter = require('./routers/home');
const coursesRouter = require('./routers/courses');
const addRouter = require('./routers/add');
const basketRouter = require('./routers/basket');
const ordersRouter = require('./routers/orders');
const aouthRouter = require('./routers/aouth');




const app = express();



app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async(req, res, next)=>{
    try{
        const user = await User.findById('6032aeba20bf681870e32e44');
        req.user = user;
        next();
    }catch(e){
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}))

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/basket', basketRouter);
app.use('/orders', ordersRouter);
app.use('/aouth', aouthRouter);


const PORT = process.env.PORT || 3000;

async function start(){
    try{
        const url = 'mongodb+srv://derek:1234@cluster0.6ccds.mongodb.net/shop';
        await mongoose.connect(url, {useNewUrlParser : true, useUnifiedTopology: true, useFindAndModify: false});
        const candidate = await User.findOne();
        if(!candidate){
            const user = new User({
                email: 'derek23@yandex.ru',
                name : "derek23",
                basket : {items : []}
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`server is running in port ${PORT}.....`);
        })

    }catch(e){
        console.log(e);
    }
}

start();



