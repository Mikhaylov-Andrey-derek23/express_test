module.exports = function(req, res, next){
    if(!req.session.isAutheticated){
        return res.redirect('/aouth#login')
    }
    next();
}