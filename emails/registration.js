const keys = require('../keys');

module.exports = function(email, name){
    return {
        to : email,
        from : "derek23@yandex.ru",
        subject : "Акаунт создан", 
        html : `
            <h1>Добро пожаловать в наш магазин </h1>
            <p>Вы ${name} успещно создали акаунт с email - ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Страница магазина</a> 
        `
    }
}