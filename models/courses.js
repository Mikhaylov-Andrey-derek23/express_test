// const {v4:uuidv4} = require('uuid');
// const fs = require('fs');
// const path = require('path');

// class Courses{
//     constructor(title, price, img){
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.uuid = uuidv4();

//     }

//     toJson(){
//         return {
//             uuid : this.uuid,
//             title : this.title,
//             price : this.price,
//             img : this.img
//         }
//     }

//     async save(){
//         const courses = await Courses.getAll();
//         courses.push(this.toJson());

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if(err){
//                         reject(err)
//                     }else{
//                         resolve();
//                     }
//                 }
//             )
//         }) 
//     }

//     static getAll(){
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if(err){
//                         reject(err);
//                     }else{
//                         resolve(JSON.parse(content));
//                     }
//                 }
//             )
//         })
//     }

//     static async getById(id){
//         const courses = await Courses.getAll();
//         return courses.find(e => e.uuid == id)
//     }

//     static async upData(body){
//         const courses = await Courses.getAll();
//         const idx = courses.findIndex(e => e.uuid == body.uuid);
//         courses[idx] = body; 
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if(err){
//                         reject(err)
//                     }else{
//                         resolve();
//                     }
//                 }
//             )
//         }) 
//     }
// }

// module.exports = Courses;


const {Schema, model} = require('mongoose');

const course  = new Schema(
    {
        title : {
            type : String,
            require : true
        },
        price : {
            type : Number,
            require : false
        }, 
        img : String,
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'User',
            require : true
        }

    }
);

module.exports = model('Courses', course);