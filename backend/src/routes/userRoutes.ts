import express from "express"
import {  loginUser, registerUser } from "../services/userManager";


export const router = express.Router();


router.post("/register" , async (req , res ) => {
    try {
        const{name ,email ,password} = req.body;
        const user = await registerUser(name , email , password);
        res.status(201).json({
            message : "User Registered Successfuly",
            user,
        });
    } catch (error ) {
        res.status(400).json({
            message : "Registration Error !",
            error 
        });
    }
});


router.post("/login" , async (req ,res) => {
    try {
        const{ email , password} = req.body;
        const {user , token} = await loginUser(email , password);
        res.status(200).json({
            message : "login successful",
            user ,
            token,
        });
    } catch (error) {
        res.status(401).json({
            message : "failed to login!",
            error,
        })
    }})


