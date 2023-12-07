const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    } else{
        return next();
    }
};

exports.validateRsvp = [body('rsvp').exists().withMessage('RSVP cannot be empty')
                        .if(body('rsvp').exists()).toUpperCase().isIn(['YES','NO', 'MAYBE']).withMessage('RSVP can only be YES, NO or MAYBE')];

exports.validateSignUp = [body('firstName','First Name cannot be empty').notEmpty().trim().escape(),
body('lastName','Last Name cannot be empty').notEmpty().trim().escape(),
body('email','Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be atlest 8 characters and at most 64 characters').isLength({min:8, max:64})];

exports.validateLogIn = [body('email','Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be atlest 8 characters and at most 64 characters').isLength({min:8, max:64})];


exports.validateResult = (req,res,next)=>{
    console.log('validateResult');
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        console.log(errors)
        return res.redirect('back');
    }else{
        return next();
    }
};

exports.validateEvent = [body('topic', 'event topic cannot be empty').notEmpty().trim().escape(),
body('title', 'event title cannot be empty').notEmpty().trim().escape(),
body('host', 'event host cannot be empty').notEmpty().trim().escape(),
body('details', 'event details cannot be empty').isLength({min:10}).trim().escape(),
body('where', 'event location cannot be empty').notEmpty().trim().escape(),
body('when', 'event date cannot be empty').custom((when, { req }) => {
    const currentDate = new Date();
    const inputDate = new Date(when);
    console.log('date', inputDate);

    return inputDate.toISOString().slice(0, 10) >= currentDate.toISOString().slice(0, 10);
})
.withMessage("Date must be a valid format and occur after today.").trim().escape(), 
body('starttime', 'event start time cannot be empty').matches(/^(\d{2}):(\d{2})$/),
body('endtime', 'event end time cannot be empty').matches(/^(\d{2}):(\d{2})$/).custom((endtime, { req }) => {
    const startTime = req.body.starttime;
    const endTime = endtime;
    console.log('starttime',startTime);
    console.log('endtime',endTime)
    return startTime && endTime && startTime < endTime;
  })
  .withMessage('end time must come after start time'),
body('image', 'event image cannot be empty').notEmpty(),
]

// //time
// body('start', 'start must be a valid time').matches(/^(\d{2}):(\d{2})$/),
//     body('end', 'end must be a valid time')
//       .matches(/^(\d{2}):(\d{2})$/)
//       .custom((value, { req }) => {
//         const startTime = req.body.start;
//         const endTime = value;
//         return startTime && endTime && startTime < endTime;
//       })
//       .withMessage('end time must come after start time'),
      
//       //date

//       body("date", "Date must be valid format and occur after today.")
//     .custom((date, { req }) => {
//         const currentDate = new Date();
//         const inputDate = new Date(date);

//         return inputDate.toISOString().slice(0, 10) >= currentDate.toISOString().slice(0, 10);
//     })
//     .withMessage("Date must be a valid format and occur after today.")
//     .trim()
//     .escape(),