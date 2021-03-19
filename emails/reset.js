const keys = require('../keys');

module.exports = function(email, name, token){
    return {
        to : email,
        from : "derek23@yandex.ru",
        subject : "Востановление пароля", 
        html : `
            <h1>${name} от Вас поступил запрос на смену пароля</h1>
            <p>Если ${name} не запрашивали, то проигнорируете данное письмо</p>
            <p>Если запрашивали то передите по ссылке ниже</p>
            <p><a href="${keys.BASE_URL}/aouth/password/${token}">Страница смена пароля</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Страница магазина</a> 
        `
    }
}