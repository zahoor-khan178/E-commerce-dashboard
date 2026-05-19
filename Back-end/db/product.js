





const mongoose=require('mongoose')

const productschema= new mongoose.Schema({

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

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

company:{
    type:String,
    required:true
},

},{collection:'products'});

const product= mongoose.model('product', productschema);

console.log('product schema defined successfuly');

module.exports= product;