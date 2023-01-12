import express from "express";
import { comparePassword, hashPassword } from "../helpers/bycrypt.js";
import { getUser, getUserById, insertUser } from "../models/user/User.Model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("User router got hit");
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = hashPassword(req.body.password)
    req.body.password = hashedPassword
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
      res.json({
        status: "success",
        result,
      });
    } else {
      res.json({
        status: "error",
        message: "User not found, try again later",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login',async(req,res,next)=>{
    try {
       const {username,password} = req.body
       const result =  await getUser({username})
       if(result?._id){
            const isMatched = comparePassword(password,result.password)
            if(isMatched){
                result.password=undefined
                res.json({
                    status:"success",
                    message:"User login successful",
                    result
                })
                return
            }

       }else{
        res.status(401).json({
            status:"error",
            message:"Inavlid Credentials, please try again!"
        })
       }
        
    } catch (error) {
        next(error)
    }
})
export default router;
