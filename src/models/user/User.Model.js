import UserSchema from "./User.Schema.js";

export const insertUser=(obj)=>{
    return UserSchema(obj).save()
}

export const getUserById=(_id)=>{
    return UserSchema.findById(_id)
}

export const getUser=filter=>{
    return UserSchema.findOne(filter)
}

export const updateUser=(filter,obj)=>{
    return UserSchema.findOneAndUpdate(filter,obj,{new:true})
}

export const deleteUser=(_id)=>{
    return UserSchema.findByIdAndDelete(_id)
}