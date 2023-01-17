import express from "express";
import {
  deletePost,
  getPostById,
  insertPost,
  updatePost,
} from "../models/post/Post.Model.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const result = await insertPost(req.body);
    if (result?._id) {
      res.json({
        status: "success",
        message: "Post inserted successfully",
      });
    } else {
      res.json({
        status: "error",
        message: "Couldn't add post",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = await getPostById(_id);
    if (result?._id) {
      res.status(200).json({
        status: "success",
        result,
      });
    } else {
      res.status(403).json({
        status: "error",
        message: "Post doesn't exist, try again later",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:_id", async (req, res, next) => {
  try {
    const result = await getPostById(req.params._id);
    const { userId, ...rest } = req.body;
    if (result.userId === userId) {
      const updatedPost = await updatePost(result._id, rest);
      if (updatedPost?._id) {
        res.json({
          status: "success",
          message: "Post updated successfully",
          updatedPost,
        });
      } else {
        res.json({
          status: "error",
          message: "Couldn't update post",
        });
      }
    } else {
      res.json({
        status: "error",
        message: "Post not found !",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { userId } = req.body;
    const getPost = await getPostById(_id);
    if (getPost.userId === userId) {
      const deletedPost = await deletePost(_id);
      if (deletedPost?._id) {
        res.json({
          status: "success",
          message: "Post deleted successfully",
        });
      }
      return;
    } else {
      res.json({
        status: "error",
        message: "Couldn't delete post, try again later",
      });
    }
  } catch (error) {
    next(error);
  }
});

// like a post
router.put('/:_id/like',async(req,res,next)=>{
    try {
        const {_id} = req.params
        const {userId} = req.body
        const findPost = await getPostById(_id)
        if(!findPost.likes.includes(userId)){
         await findPost.updateOne({$push:{likes:userId}})
        res.status(200).json("post liked")

        }else{
            await findPost.updateOne({$pull:{likes:userId}})
            res.status(200).json("post disliked")
        }
    } catch (error) {
        next(error)
    }
})




export default router;
