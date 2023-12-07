const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
        userid:{type:Schema.Types.ObjectId, ref: 'User'},
        topic: {type:String, required:[true,'topic of the event is required']},
        title: {type:String, required:[true,'title of the event is required']},
        host: {type:String, required:[true,'host of the event is required']},
        details: {type:String, required:[true,'details of the event are required'],minLength:[10, 'the details should have at least 10 characters']},
        where: {type:String, required:[true,'place where event will take place is required']},
        when: {type:String, required:[true,'date of the event is required']},
        starttime: {type:String, required:[true,'starting time of the event is required']},
        endtime: {type:String, required:[true,'ending time of the event is required']},
        image: {type:String, required:[true,'image of the event is required']}
});

module.exports = mongoose.model('Event', eventSchema);
