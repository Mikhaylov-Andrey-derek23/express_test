module.exports = function(req, res, next){
    res.locals.isAuth = req.session.isAutheticated;
    res.locals.csrf = req.csrfToken();

    if(req.session.user && req.session.user.typeUser == 'admin'){
        res.locals.isUserAdmin = true
    }

    
    next();
}