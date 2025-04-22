const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const AuthRouter=require('./Routes/AuthRouter');

require('./Models/db');
require('dotenv').config();



const port=process.env.PORT || 8087;




app.use(bodyParser.json());
app.use(cors());  //we can ad configuration object here if needed ...so that only our perticular client server can send request to our host server



app.use('/auth',AuthRouter);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});