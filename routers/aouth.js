const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const registatorEamil = require('../emails/registration');
const router = Router();


const transport = nodemailer.createTransport(sendgrid({
    auth : {api_key : keys.SENDGRIP_API_KEY}
}))

router.get('/', async(req, res)=>{
    res.render('login/aouth', {
        title : 'Авторизация',
        isLogin : true,
        errorLogin : req.flash('errorLogin'),
        errorRegister : req.flash('errorRegister')
    })
})

router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(user){
            const areSame = await bcrypt.compare(password, user.password);
            if(areSame){
                req.session.user = user;
                req.session.isAutheticated = true;
                req.session.save(err=>{
                    if(err){
                        throw err;
                    }
                    res.redirect('/');
                })

            }else{
                req.flash('errorLogin', 'Пароль не верный');
                res.redirect('/aouth#login') 
            }
            
        }else{
            req.flash('errorLogin', 'Такого email нет');
            res.redirect('/aouth#login')
        }
        

    }catch(e){
        console.log(e)
    }
    // const user = await User.findById('6032aeba20bf681870e32e44');
    // req.session.user = user;
    
    // req.session.isAutheticated = true;
    // req.session.save(err=>{
    //     if(err){
    //         throw err;
    //     }
    //     res.redirect('/');
    // })

})
router.get('/logout', async(req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
    
})

router.post('/register', async(req, res)=>{
    try{
        const {email, name, password, confirm} = req.body;
        const candidate = await User.findOne({email});
        if(candidate){
            req.flash('errorRegister', 'Такой email уже есть');
            res.redirect('/aouth#register');
        }
        else if(password != confirm){
            req.flash('errorRegister', 'Пароль не совпадает');
            res.redirect('/aouth#register');
        }else{
            haspassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                name,
                password: haspassword,
                basket : {items : []}
            })
            user.save();
            res.redirect('/aouth#login');
            await transport.sendMail(registatorEamil(email, name));
        }

        
    }catch(e){
        console.log(e)
    }
}) 


module.exports = router;