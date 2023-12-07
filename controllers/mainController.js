const User =require("../models/user")

// router.get('/',
exports.index = (req,res,next)=>{
    let user =req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('index',{user})
    })
    .catch(err=>next(err));
    
};

// router.get('/about',
exports.about = (req,res,next)=>{
    let user =req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('about',{user})
    })
    .catch(err=>next(err))
    
};

// router.get('/contact',
exports.contact = (req,res,next)=>{
    let user =req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('contact',{user})
    })
    .catch(err=>next(err))
};