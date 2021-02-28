const {Router} = require('express');
const Courses = require('../models/courses');
const Basket = require ('../models/basket');
const User = require('../models/user');

function getAllPrice(course){
    return course.reduce((total, course)=>{
        return total + (course.count * course.courseID.price)
    }, 0)
}

const router = Router();

router.get('/', async (req, res)=>{
    const user = await req.user.populate('basket.items.courseID').execPopulate();
    res.render('basket', {
        title : 'Корзина',
        isBasket : true,
        basket : user.basket.items,
        totalPrice : getAllPrice(user.basket.items)
    })
})

router.post('/add', async(req, res)=>{
    const course = await Courses.findById(req.body.id);
    req.user.addToBasket(course);
    res.redirect('/basket');
})

router.delete('/remove/:id', async(req, res)=>{
    req.user.removeBasketCourse(req.params.id); 
    const user = await req.user.populate('basket.items.courseID').execPopulate();
    const basket = {course : user.basket.items, price : getAllPrice(user.basket.items)}
    res.status(200).json(basket);
    res.end;
    
})

module.exports = router;