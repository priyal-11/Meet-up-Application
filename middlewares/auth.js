const event = require('../models/event');

exports.isGuest = (req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile')
    }
};


exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login')
    }
};

exports.isAuthor =(req,res,next)=>{
    let id = req.params.id;
    event.findById(id)
    .then(event=>{  
        if(event){
            if(event.userid == req.session.user){
                return next();
            }
            else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
        else{
            let err= new Error("Cannot find a event with id" + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotAuthor =(req,res,next)=>{
    let id = req.params.id;
    event.findById(id)
    .then(event=>{  
        if(event){
            if(event.userid != req.session.user){
                return next();
            }
            else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
        else{
            let err= new Error("Cannot find a event with id" + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};