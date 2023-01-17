import express from 'express'
import { insertPost } from '../models/post/Post.Model.js'

const router = express.Router()

router.post('/',async(req,res,next)=>{
    try {
        const result = await insertPost(req.body)
        if(result?._id){
            res.json({
                status:"success",
                message:"Post inserted successfully"
            })
        }else{
            res.json({
            status:"error",
            message:"Couldn't add post"
            })
        }
    } catch (error) {
        next(error)
    }
})

export default router