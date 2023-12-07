const User = require('../models/user')
const event  =require('../models/event')
const rsvpModel =require('../models/rsvp')

exports.new = (req,res)=>{
        return res.render('./user/new')
};

exports.create = (req,res,next)=>{
    let user = new User(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(()=>res.redirect('/users/login'))
    .catch(err=> {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000){
            req.flash('error', 'Email address has been used')
            return res.redirect('/users/new');
        }
        next(err)
    });
}

exports.getLogin = (req, res)=> {
        res.render('./user/login');
};

exports.postLogin = (req,res,next)=>{
    let email =req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password =req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(user){
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id; 
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                }
                else{
                    //console.log('wrong password')
                    req.flash('error', 'Wrong password!')
                    res.redirect('/users/login')
                }
            })
        }else{
            //console.log('wrong email address')
            req.flash('error', 'Wrong email address!')
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err)) 
}

exports.getProfile = (req,res,next) =>{
    let id =req.session.user;
    Promise.all([User.findById(id), event.find({userid: id}),rsvpModel.find({user:id}).populate('connection')])
    .then(result=>{
        const[user,events,rsvps] = result;
        console.log(rsvps);
        res.render('./user/profile',{user,events,rsvps})
    }) 
    .catch(err=>next(err));
}


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};