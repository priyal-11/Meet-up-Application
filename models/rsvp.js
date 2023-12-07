const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    rsvp:{type:String, enum:['YES','NO', 'MAYBE'], required:[true,'RSVP is required']},
    user: {type:Schema.Types.ObjectId, ref:'User', required:[true, 'User is required']},
    connection: {type:Schema.Types.ObjectId, ref:'Event', required:[true, 'Event is required']},
},{timestamps:true});

module.exports = mongoose.model('Rsvp', rsvpSchema);