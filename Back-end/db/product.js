





const mongoose=require('mongoose')

const productschema= new mongoose.Schema({

    name:{
              type:String,
              required:true,
          
    },
    price:{
        type:String,
        required:true,

},
category:{
    type:String,
    required:true
},
userid:{
    type:String,
    required:true
},
company:{
    type:String,
    required:true
},

},{collection:'products'});

const product= mongoose.model('product', productschema);

console.log('schema defined successfuly');

module.exports= product;