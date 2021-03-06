const {Schema, model} = require('mongoose');

const users = new Schema({
    email : {
        type: String,
        require : true
    },
    name : String,
    password : {
        type: String,
        require : true
    },
    typeUser : {
        type : String,
        default : 'user'
    }, 
    dateRegister : {
        type : Date,
        default : Date.now
    },
    basket : {
        items : [
            {
                count : {
                    type: Number,
                    require: true,
                    default : 1
                },
                courseID : {
                    type : Schema.Types.ObjectId,
                    ref : 'Courses',
                    require : true
                } 
            }

        ]
    }
})

users.methods.addToBasket = function(course){
    const items = [...this.basket.items];
    const idx = items.findIndex(e => e.courseID.toString() == course._id.toString());
    if(idx >= 0){
        items[idx].count = items[idx].count + 1;

    }else{
        items.push({
            count : 1,
            courseID : course._id
        })
    }
    this.basket = {items};
    return this.save();
}

users.methods.removeBasketCourse = function(id){
    let items = [...this.basket.items];
    const idx = items.findIndex(e => e.courseID.toString() == id.toString());
    if(items[idx].count > 1){
        items[idx].count --;
    }else{
        items = items.filter(e => e.courseID.toString() !== id.toString())
    }
    this.basket = {items}
    return this.save();
}

users.methods.clearBasket = function(){
    this.basket = {items : []};
    return this.save();
} 



module.exports = model('User', users)