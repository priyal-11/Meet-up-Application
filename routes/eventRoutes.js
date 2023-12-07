const express =require('express');
const controller  = require('../controllers/eventController'); 
const {isLoggedIn,isAuthor,isNotAuthor} = require('../middlewares/auth')
const {validateId,validateEvent,validateRsvp,validateResult} = require('../middlewares/validator')

const router = express.Router();

//get  /connections: connections page where all events are displayed 
router.get('/',controller.connections);

//get /connections/new: html form for creating a new event
router.get('/new',isLoggedIn,controller.new)

//post /connections :create a new story 
router.post('/',isLoggedIn,validateEvent,validateResult,controller.create);

//get /connections/:id send details of the event identified by id
router.get('/:id',validateId,controller.show);

//get /connections/:id/edit: send html form for editing existing event
router.get('/:id/edit',validateId,isLoggedIn,isAuthor,controller.edit);

//put /connections/:id update the event
router.put('/:id',validateId,isLoggedIn,isAuthor,validateEvent,validateResult,controller.update);

//delete /connections/:id delete the event
router.delete('/:id',validateId,isLoggedIn,isAuthor,controller.delete);

router.post('/:id/rsvp',validateId,isLoggedIn,isNotAuthor,validateRsvp,validateResult,controller.editRsvp);

module.exports = router;