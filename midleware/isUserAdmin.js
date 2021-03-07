module.exports = function(req, res, next){
    
    if(req.user.typeUser == 'user'){
        return res.redirect('/aouth#login');

    }
    next();
}