import PostSchema from "./Post.Schema.js";

export const insertPost = (obj) => {
  return PostSchema(obj).save();
};


export const getPostById=(_id)=>{
    return PostSchema.findById(_id)
}

export const getAllPost=()=>{
    return PostSchema.find()
}

export const updatePost = (filter,obj)=>{
return PostSchema.findOneAndUpdate(filter,obj,{new:true})
}

export const deletePost=(_id)=>{
    return PostSchema.findByIdAndDelete(_id)
}