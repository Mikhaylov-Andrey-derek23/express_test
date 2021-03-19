const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const registatorEamil = require('../emails/registration');
const resetPasswordEmail = require('../emails/reset');
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

router.get('/reset', async(req, res)=>{
    res.render('login/reset', {
        title : 'Востановление пароля',
        errorLogin : req.flash('errorLogin')
    })
})

router.post('/reset', async(req, res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            req.flash('errorLogin', 'Нет такого email');
            res.redirect('/aouth/reset');
        }else{
            crypto.randomBytes(32, async(err, buffer)=>{
                if(err){
                    console.log(err);
                    req.flash('errorLogin', 'Возникла проблема на сервере повторите попытку');
                    res.redirect('/aouth/reset');
                }else{
                    const token = buffer.toString('hex');
                    user.resetToken = token;
                    user.resetTokenDate = Date.now() + 60*60*1000;
                    await user.save();
                    await transport.sendMail(resetPasswordEmail(user.email, user.name, token));
                    res.redirect('/aouth');
                }
            })
            res.redirect('/aouth');
        }

    }catch(e){
        console.log(e)
    }

})

router.get('/password/:token', async(req, res) =>{
    try{
        if(!req.params.token){
            return res.redirect('/aouth');
        }
        const user = await User.findOne({
            resetToken : req.params.token,
            resetTokenDate : {$gt : Date.now()}
        })
        if(user){
            res.render('login/password', {
                title : 'Смена пароля',
                isId : user._id,
                isToken : req.params.token,
                errorLogin : req.flash('errorLogin')

            })    
        }else{
            req.flash('errorLogin', 'Время токена истекло');
            res.redirect('/aouth#login') 
        }


    }catch(e){
        console,log(e)
    }


})

router.post('/password', async(req, res)=>{
    try{
        const {password, repeatPassword, idUser, token} = req.body
        const user = await User.findOne({
            resetToken : token,
            resetTokenDate : {$gt : Date.now()},
            _id : idUser
        })
        if(user){
            if(password == repeatPassword){
                const haspassword = await bcrypt.hash(password, 10)
                user.password = haspassword;
                user.resetToken = undefined;
                user.resetTokenDate = undefined;
                user.save();
                res.redirect('/aouth');
            }else{
                req.flash('errorLogin', 'Пароли не совпадают')
                res.redirect(`/aouth//password/${token}`);
            }

        }else{
            res.redirect('/aouth#login')
        }
    }catch(e){
        console.log(e)
    }
    
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