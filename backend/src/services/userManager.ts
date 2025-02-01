import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET!; 

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  



// registering a new user.

export async function registerUser(name : string , email : string , password : string) {

    const hashedPassword = await bcrypt.hash(password , 10)
    return await prisma.user.create({
        data : {
            name ,
            email,
            password:hashedPassword
        },
    });
    
}

// login existing user.

export async function loginUser(email:string , password:string) {

    const user = await prisma.user.findUnique({
        where :{
            email,
        }
    })

    if(!user) {
        throw new Error("User Not Found !");
    }

    const validPassword = await bcrypt.compare(password , user.password);
    if(!validPassword) {
        throw new Error("invalid credentials !");
    }

    const token = jwt.sign({
        id: user.id ,
        email: user.email
    } ,SECRET_KEY, {
        expiresIn:"1h",
    });

    return{user , token};
    
}


