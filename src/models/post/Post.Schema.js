import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  desc:String,
  likes:[],
  image:String
},
{
    timestamps:true
});

export default mongoose.model('post',postSchema)