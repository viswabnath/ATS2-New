const mongoose= require('mongoose');

const userschema = mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    token:String,
    
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        select:false
    },
    mobile:{
        type:String,
        unique:true,
        required:true
    },
    emailVerifyCode:String,
    emailVerifed:{
         type:Boolean,
         enum:[true,false],
         default:true
    },
    roleApplied:{
        type: String,
        enum: ["JOBSEEKER", "COMPANY","ADMIN","EMPLOYEE","FREELANCE-RECRUITER","INTERN","OTHER","MANAGER"],
         required:true
    },
    homePhone:String,
    officePhone:String,
    fax:String,
    otherEmail:String,
    role:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Roles',
        
    }],
    level1Verified:{
        type:Boolean,
        enum:[true,false],
        default:false
    },
    level2Verified:{
        type:Boolean,
        enum:[true,false],
        default:false
    },
    title:String,
    department:String,
    signature:String,
    country:String,
    city:String,
    state:String,
    postalCode:String,
    streetAddress:String,
    password:String,
    empId:String

});

userschema.indexes({ phonenumber: 1,email:1 }, { unique: true, sparse: true })
userschema.pre('save', function () {

})


module.exports = mongoose.model("User", userschema);