

const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/userschema');
const product = require('./db/product');
const jwt=require('jsonwebtoken');
const jwtkey="e-comm";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, resp) => {
   try {
      const user = new User(req.body);
      let result = await user.save();
      result = result.toObject();
      delete result.password;

      
            // jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{

            //    if(err){

            //       resp.send('something went wrong')
            //    }
            //    else{

            //          resp.send({result,auth:token})
            //    }
            // })

            resp.send(result);

   } catch (error) {       
    console.log('Error in signup API:',error);    
}

});


app.post('/login', async (req, resp) => {

   try {

      if (req.body.email && req.body.password) {



         const user = await User.findOne(req.body).select('-password')
         if (user) {

            // jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{

            //    if(err){

            //       resp.send('something went wrong')
            //    }
            //    else{

            //          resp.send({user,auth:token})
            //    }
            // })

            resp.send(user)

            
         }
         else {

            resp.send('no user found')
         }
      }
      else {

         resp.send('no user found')
      }

   }
   catch (err) {

      console.log('error in login api:', err);

   }
})

app.post('/add-product', async (req, resp) => {

   const newproduct = new product(req.body);
   const result = await newproduct.save();
   resp.send(result);



})

app.get('/product', async (req, resp) => {

   const products = await product.find()
   if (products.length > 0) {

      resp.send(products);
   } else {

      resp.send({ result: "no record found" })
   }
})

app.delete('/delete/:id', async (req, resp) => {

   // resp.send('api in progress...');
   const result = await product.deleteOne({ _id: req.params.id })
   resp.send(result)


})


app.get('/update/:id', async (req, resp) => {

   const result = await product.findOne({ _id: req.params.id })
   if (result) {

      resp.send(result)
   }
   else {

      resp.send('no result found');
   }

})


app.put('/update/:id', async (req, resp) => {

   const result = await product.updateOne({ _id: req.params.id }, { $set: req.body })
   resp.send(result);
})


app.get('/search/:key', async (req, resp) => {

   const result = await product.find({

      "$or": [

   {name: { $regex:req.params.key }},
   {price: { $regex:req.params.key }},
   {category: { $regex:req.params.key }},
   {company: { $regex:req.params.key }},

      
   
      ]

   })

   if(result)
   {
      resp.send(result)

   }
   else{

      resp.send("error while searching data.")
   }

})




app.listen(9000);