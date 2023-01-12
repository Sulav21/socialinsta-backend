import mongoose from "mongoose";

export const dbConnection =()=>{
   try {
    const dbConnect = mongoose.connect(process.env.MONGO_CLIENT,{useNewUrlParser:true,useUnifiedTopology:true})
    dbConnect && console.log("MongoDB connection successful")
    
   } catch (error) {
    console.log(error)
   }

}