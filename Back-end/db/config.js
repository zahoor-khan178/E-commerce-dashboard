
const mongoose=require('mongoose');

const dbconnection=()=>{

mongoose.connect("mongodb://localhost:27017/E-dashboard")
.then(()=>{

    console.log('db connected successfuly.');
    
})
.catch(()=>{

    console.log('error while connecting to db.')
})
}

dbconnection();