const mongoose= require('mongoose');
const { stringify } = require('uuid');

const candidateSchema =  mongoose.Schema({

    RequirementId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Requirement"
    },
    RequirementName:{
        type:String,
    },
    JobCode:String,
    resumeid:String,
    //candidate details
    candidateskills:[String],
    candidatefirstname:String,
    candidatelastname:String,
    candidatenumber:String,
    candidateemail:String,
    country:String,
    state:String,
    currentlocation:String,
    DOB:String,
    pannumber:String,
    highestdegree:String,
    university:String,
    passingyear:String,
    worklocation:String,
    totalexp:String,
    relevantexp:String,
    currentctc:String,
    expectedctc:String,
    noticeperiod:String,
    currentcompany:String,
    durationfrom:String,
    durationto:String,

//     Location:String,
//     Experience:String,
//     Postions:String,
//     NoOfPosts:String,
    // Skills:[String],
//     PrimarySkill:String,
// CreatedDate:String,
//     AssignedAM:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },
//     AssignedIA:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User"
//         }
//     ],
//     Status:{
//         type:String,
//         enum:['ACTIVE','INACTIVE'],
//         default:'ACTIVE'
//     },
//     Comment:String,
//     MaxCTC:Number,
//     ECVS:Number,
//     Description:String,
//     Suggestion:String,
//     InternalJobCode:String

});




module.exports = mongoose.model("Candidate", candidateSchema);