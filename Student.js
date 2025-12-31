const mongoose=require("mongoose");

const qualificationSchema=new mongoose.Schema({
    degree:{type:String,required : true },
    institution :{type:String,required : true }
});

const studentSchema =new mongoose.Schema({
     name:{type:String,required : true },
    dob:{type:String,required : true },
    gender:{type:String,required : true },
    mobile:{type:String,required : true ,match:/^[0-9]{10}$/},
    email:{type:String},
    bloodGroup:{type:String},
    nationality:{type:String},
    physicallyChallenged:{type:String},
    qualification:{type:[qualificationSchema], default: []},
    image:{type:String}
})

module.exports=mongoose.model("Student",studentSchema);