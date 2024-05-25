const { json } = require('body-parser');
const express= require('express');
const mongoose=require('mongoose');
const cors =require('cors')



const app = express();
app.use(express.json())
app.use(cors())

//const bodyParser=require('body-parser');

//let todos=[];
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('Db connected!! ')
})

.catch((err)=>{
console.log(err)
})

const todoschema= new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    }
})

//model
const todomodel= mongoose.model('todo',todoschema);
//create
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
    // const newTodo={
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
try{
    const newtodo = new todomodel({title,description})
    await newtodo.save();
    res.status(201).json(newtodo);
}catch(error){

    console.log(error)
    res.status(500),json({message:error.message });
}
    
})

app.get('/todos',async(req,res)=>{
    try {
      const todos= await todomodel.find();
      res.json(todos);
    } catch (error) {
         console.log(error)
         res.status(500),json({message:error.message });
        
    }
    

})
//update
app.put('/todos/:id',async(req,res)=>{
    try{
    const {title,description}=req.body;
   const id= req.params.id;
    const updatedTodo= await todomodel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
    if (!updatedTodo) {
        return res.status(404).json({message:"not found data broo!!"})
    }
    res.json(updatedTodo)
}catch(error){
    console.log(error)
    res.status(500),json({message:error.message });
}
})

//delete 
app.delete('/todos/:id',async(req,res)=>{
try{
    const id=req.params.id;
    await todomodel.findByIdAndDelete(id);
    //res.status(204).end();
    res.status(200).json({message:" data deleted broo!!"})
   
}catch(error){
    console.log(error)
    res.status(500),json({message:error.message });

    }

})
//server
const port=8000;
app.listen(port,()=>{
    console.log('server is listing   '+port);
})

