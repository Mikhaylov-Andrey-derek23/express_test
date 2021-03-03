const {Router} = require('express');

const router = Router();

router.get('/', async(req, res)=>{
    res.render('aouth', {
        title : 'Авторизация',
        isLogin : true
    })
})


module.exports = router;