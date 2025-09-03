
const mongoose=require('mongoose')

const userschema= new mongoose.Schema({

    name:{
              type:String,
              required:true,
          
    },
    email:{
        type:String,
        required:true,

},
password:{
    type:String,
    required:true
},

},{collection:'user'});

const user= mongoose.model('user',userschema);

console.log('user schema defined successfuly');

module.exports= user;