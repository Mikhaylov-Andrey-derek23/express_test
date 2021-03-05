const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/', async(req, res)=>{
    res.render('login/aouth', {
        title : 'Авторизация',
        isLogin : true
    })
})

router.post('/login', async(req, res)=>{
    const user = await User.findById('6032aeba20bf681870e32e44');
    req.session.user = user;
    
    req.session.isAutheticated = true;
    req.session.save(err=>{
        if(err){
            throw err;
        }
        res.redirect('/');
    })

})
router.get('/logout', async(req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
    
})


module.exports = router;