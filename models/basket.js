const path = require("path");
const fs = require("fs");


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'basket.json'
)

class Basket{
  
    static async fetch(){
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(JSON.parse(content));
                }
            })
        })
    }
    

    static async add(course){
        const basket = await Basket.fetch(); 
        const idx = basket.course.findIndex(e => e.uuid == course.uuid);
        const candidate = basket.course[idx];
        if (candidate){
            candidate.count++;
            basket.course[idx] = candidate
        }else{
            course.count = 1;
            basket.course.push(course)
        }
        basket.price += +course.price;
        return new Promise((resolve, reject)=>{
            fs.writeFile(p, JSON.stringify(basket), (err) =>{
                if(err){
                    reject(err);
                }else{
                    resolve()
                }
            })
        })
        
    }

    static async remove(id){
        const basket = await Basket.fetch();
        const idx = basket.course.findIndex(e => e.uuid == id)
        if(basket.course[idx].count >1){
            basket.course[idx].count --;
            basket.price = basket.price - basket.course[idx].price;
            
        }else{
            basket.price = basket.price - basket.course[idx].price;
            basket.course = basket.course.filter(e => e.uuid != id);
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(basket), (err)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(basket)
                }
            })
        })
    
    }
}

module.exports = Basket;