import express from 'express'
import { getPostById, insertPost } from '../models/post/Post.Model.js'

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

router.get("/:_id",async(req,res,next)=>{
    try {
          const {_id} = req.params
          const result  = await getPostById(_id)
          if(result?._id){
            res.status(200).json({
                status:"success",
                result
            })
          }else{
            res.status(403).json({
            status:"error",
            message:"Post doesn't exist, try again later"
            })
          }
    } catch (error) {
        next(error)
    }
})

export default router