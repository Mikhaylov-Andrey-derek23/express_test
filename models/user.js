const {Schema, model} = require('mongoose');

const users = new Schema({
    email : {
        type: String,
        require : true
    },
    name : {
        type : String,
        require : true
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

module.exports = model('User', users)