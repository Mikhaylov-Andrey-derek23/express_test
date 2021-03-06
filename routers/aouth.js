const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/', async(req, res)=>{
    res.render('login/aouth', {
        title : 'Авторизация',
        isLogin : true
    })
})

router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(user){
            //const areSame = await bcrypt.compare(password, user.password);
            const areSame = true
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
                res.redirect('/aouth#login') 
            }
            
        }else{
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
            res.redirect('/aouth#register')
        }
        haspassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            name,
            password: haspassword,
            basket : {items : []}
        })
        user.save();
        res.redirect('/aouth#login');
        
    }catch(e){
        console.log(e)
    }
}) 


module.exports = router;