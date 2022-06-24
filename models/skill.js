const mongoose= require('mongoose');

const skillSchema=mongoose.Schema({
    skillname:String,
})

module.exports = mongoose.model('Skills',skillSchema);