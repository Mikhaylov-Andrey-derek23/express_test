const {Router} = require('express');
const Order = require('../models/order');

const router = Router();

router.get('/', async(req, res)=>{
    try{
        const orders = await Order.find({'user.userId' : req.user._id}).populate('user.userId');
        console.log(orders)
        res.render('orders', {
            isOrders : true,
            title: 'Заказы',
            orders : orders.map(o => {
                return{
                    ...o._doc,
                    price : o.courses.reduce((total, c)=>{
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    }catch(e){
        console.log(e)
    }

})

router.post('/', async(req, res) =>{
    try{
        const user = await req.user.populate('basket.items.courseID').execPopulate()
        const courses = user.basket.items.map(e => ({
            count : e.count,
            course : {...e.courseID._doc}
        })) 
        const order = new Order({
            user : {
                name : req.user.name,
                userId : req.user
            }, 
            courses : courses 
        })
        await order.save();
        await req.user.clearBasket();
        res.redirect('/orders');
    }catch(e){
        console.log(e)
    }

})

module.exports = router;


