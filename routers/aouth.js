const {Router} = require('express');

const router = Router();

router.get('/', async(req, res)=>{
    res.render('login/aouth', {
        title : 'Авторизация',
        isLogin : true
    })
})

router.post('/login', async(req, res)=>{
    req.session.isAutheticated = true;
    res.redirect('/');
})
router.get('/logout', async(req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    });
    
})


module.exports = router;