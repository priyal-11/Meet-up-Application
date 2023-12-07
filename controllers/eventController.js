const model = require('../models/event');
const rsvpModel = require('../models/rsvp');
const User = require('../models/user');

exports.connections = (req,res,next)=>{
    let user =req.session.user;
   Promise.all([model.find(),User.findById(user)]) 
    .then(result=>{
        const [events,user] =result
        let topic = []
        events.forEach(event=>{
            if(!topic.includes(event.topic)){
                topic.push(event.topic);
            }
        })
        res.render('./event/connections',{events,topic,user})
    })
    .catch(err=>next(err));   
};

exports.new = (req,res)=>{
    let user =req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('./event/new',{user})
    })
    
};

exports.create = (req,res,next)=>{
    let event =new model(req.body);
    event.userid = req.session.user;
    event.save()
    .then((event)=> res.redirect('/connections'))
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });
};

exports.show = (req,res,next)=>{
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([model.findById(id),rsvpModel.count({connection:id,rsvp: "YES"})])
    .then(results=>{
        const [event,rsvps] =results; 
        if(event){
           return res.render('./event/connection',{event,user,rsvps});
        }else{
            let err= new Error("Cannot find a event with id" + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req,res,next)=>{
    let id = req.params.id;
    let user =req.session.user;
    
    Promise.all([model.findById(id),User.findById(user)]) 
    .then(result=>{
        const[event,user] = result
            res.render('./event/edit',{event, user});
    })
    .catch(err=>next(err));
};

exports.update = (req,res,next)=>{
    let event = req.body;
    console.log('events',event)
    let id  = req.params.id;

    model.findByIdAndUpdate(id,event,{runValidators:true})
    .then(result=>{
            res.redirect('/connections/'+id)
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)});
};

exports.delete = (req,res,next)=>{
    let user = req.session.user;
    if(user){
        let id = req.params.id;
        Promise.all([model.findByIdAndDelete(id),rsvpModel.deleteMany({connection:id})])
        .then(result=> { 
            req.flash('success','Successfully deleted Event and RSVPs')
            res.redirect('/connections');
    })
        .catch(err=>{
            if(err.name === 'ValidationError'){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            next(err)})
    }
    
}

exports.editRsvp = (req,res,next)=>{
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({connection:id,user:req.session.user})
    .then(rsvp=>{
        if(rsvp){
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp}, {useFindAndModify: false, runValidators:true})
            .then(rsvp=>{
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile')
            })
            .catch(err=>{
                if(err.name === 'ValidationError'){
                    req.flash('error',err.message);
                    return res.redirect('/back');
                }
                next(err)});
        }
        else{
            let rsvp = new rsvpModel({
                connection:id,
                rsvp: req.body.rsvp,
                user:req.session.user
            });
            rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Successfully created RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                req.flash('error',err.message);
                next(err)});
        }
    })

}

