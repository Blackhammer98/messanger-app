import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET 

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  

interface RegisterUserRequest extends Request {

    body : {
        name : string;
        email : string;
        password : string;
    };
    
}

// registering a new user.

export const registerUser = async (req : RegisterUserRequest , res : Response):Promise<void> => {
    try {
        const {name , email , password} = req.body;
        //check if same user exists
        const existingUser: User| null   = await prisma.user.findUnique({
            where : {
                email
            }
        });

        if(existingUser) {
            res.status(400).json(
                { message: "User already exists" });
      return;
    }

  const hashedPassword:string = await bcrypt.hash(password, 10);
  //create a user

   const createUser:User =  await prisma.user.create({
    data  : {
        name ,
        email,
        password:hashedPassword,
    }
   });

   res.status(201).json({
    message : "User Registerd succesfully",
    user : createUser
   })
        

    } catch (error) {
        res.status(500).json({
            message : "Error Registering User"
        })
    }


}

// login existing user.

export const loginUser = async (req : Request , res : Response) => {
    try {
        const {email , password} = req.body;

        //check if user exists

        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!user)  {
           return res.status(400).json({
            message : "Invalid email"
           })
        }
        //compare passwords
         const matchPassword = await bcrypt.compare(password , user.password);

        if(!matchPassword) {
          return res.status(400).json({
            message : "Invalid password"
          })
        }

        //Generate jwt Token    
      
        const token  = jwt.sign({userId : user.id , email : user.email}, SECRET_KEY ,{ expiresIn: "1h" });

        res.status(200).json({
            message : "Login Successful",
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
            message : "error logging in",
            error : error
        });
        
    }
};


