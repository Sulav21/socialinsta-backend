import express from "express";
import { comparePassword, hashPassword } from "../helpers/bycrypt.js";
import {
  deleteUser,
  getUser,
  getUserById,
  insertUser,
  updateUser,
} from "../models/user/User.Model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("User router got hit");
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const result = await insertUser(req.body);
    if (result?._id) {
      res.json({
        status: "success",
        message: "User inserted successfully",
        result,
      });
    } else {
      res.json({
        status: "error",
        message: "Couldnot insert user",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:_id", async (req, res, next) => {
  try {
    const result = await getUserById(req.params);
    if (result?._id) {
      result.password = undefined;
      res.json({
        status: "success",
        result,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found, try again later",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await getUser({ username });
    if (result?._id) {
      const isMatched = comparePassword(password, result.password);
      if (isMatched) {
        result.password = undefined;
        res.json({
          status: "success",
          message: "User login successful",
          result,
        });
        return;
      }
    } else {
      res.status(401).json({
        status: "error",
        message: "Inavlid Credentials, please try again!",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/update", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await getUser({ username });
    if (result?._id) {
      const passMatched = comparePassword(password, result.password);
      if (passMatched) {
        const { username, password, ...rest } = req.body;
        const updatedUser = await updateUser({ username }, rest);
        if (updatedUser?._id) {
          updatedUser.password = undefined;
          res.status(200).json({
            status: "success",
            message: "User updated successfully",
            updatedUser,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await deleteUser(_id);
    result?._id
      ? res.json({
          status: "success",
          message: "User deleted successfully",
        })
      : res.status(404).json({
          status: "error",
          message: "Couldn't delete user, try again later",
        });
  } catch (error) {
    next(error);
  }
});

router.put('/:_id/follow',async(req,res,next)=>{
  try {
    const {_id} = req.params
    const {currentId} = req.body
    if(currentId===_id){
      res.status(403).json({
        status:"error",
        message:"Action forbidden"
      })
    }else{
      const followUser = await getUserById(_id)
      const followingUser = await getUserById(currentId)
      if(!followUser.followers.includes(currentId)){
           await followUser.updateOne({$push:{followers:currentId}})
           await followingUser.updateOne({$push:{following:_id}})
           res.status(200).json({
            status:"success",
            message:"User followed !"
           })
      }else{
        res.status(403).json({
          status:"error",
          message:"User already followed by you"
        })
      }
    }
    
  } catch (error) {
    next(error)
  }
})

// unfollowing a user
router.put('/:_id/unfollow',async(req,res,next)=>{
  try {
    const {_id} = req.params
    const {currentId} = req.body
    if(currentId===_id){
      res.status(403).json({
        status:"error",
        message:"Action forbidden"
      })
    }else{
      const followUser = await getUserById(_id)
      const followingUser = await getUserById(currentId)
      if(followUser.followers.includes(currentId)){
           await followUser.updateOne({$pull:{followers:currentId}})
           await followingUser.updateOne({$pull:{following:_id}})
           res.status(200).json({
            status:"success",
            message:"User unfollowed !"
           })
      }else{
        res.status(403).json({
          status:"error",
          message:"User is not followed by you"
        })
      }
    }
    
  } catch (error) {
    next(error)
  }
})

export default router;
