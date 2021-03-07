const {Router} = require('express');
const Courses = require('../models/courses');
const auth = require('../midleware/auth');
const isUserAdmin = require('../midleware/isUserAdmin');

const router = Router();

router.get('/', async (req, res)=>{
    const courses = await Courses.find();
    res.render('courses', {
        title : "Курсы",
        courses : courses,
        isCourses : true
    })
})
router.get('/:id', async (req, res) => {
    const course = await Courses.findById(req.params.id);
    res.render('course', {
        layout : 'empty', 
        title : `Курс ${course.title}`,
        course
    });
})

router.get('/:id/edit',  auth, isUserAdmin, async (req, res) => {
    if(req.query.allow != 'true'){
        return res.redirect('/');
    }
    const course = await Courses.findById(req.params.id);
    res.render('edit', {
        title : `Редактирование курса ${course.title}`,
        course
    })

})

router.post('/edit', auth, isUserAdmin, async(req, res)=>{
    const {id} = req.body;
    delete req.body.id;
    await Courses.findByIdAndUpdate(id, req.body);

    res.redirect('/courses');
})

router.post('/remove', auth, isUserAdmin, async(req, res)=>{
    try{
        await Courses.deleteOne({_id : req.body.id});
        res.redirect('/courses');
    }catch(e){
        console.log(e)
    }
})

module.exports = router;