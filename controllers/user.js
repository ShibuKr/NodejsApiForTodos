import { User } from "../models/users.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendCookie } from "../utils/feature.js"
import { ErrorHandler } from "../middleware/error.js"




export const getUser =(req,res)=>{

    // const id = "sfnjsjksn"

    // const {token} = req.cookies;

    // if(!token){
    //     return res.status(404).json({
    //         success:"false",
    //         message:"login first please"
    //     })
    // }

    // const decodedData = jwt.verify(token , process.env.JWT_SECRET)

    // console.log(req.cookies)
    // const user = await User.findById(decodedData._id);
    res.status(200).json({
        success:true,
        user:req.user
    })

}
export const loginUser =async(req,res,next)=>{

    try {
        const{email,password} = req.body;

        const user = await User.findOne({email}).select("+password")
    
        if(!user){
            return next(new ErrorHandler("Invalid email or password",404))
           }
    
        const isMatch = await bcrypt.compare(password,user.password)
    
        if(!isMatch){
            
                return next(new ErrorHandler("Invalid email or password",404))
               
        }
    
        sendCookie(user,res,`Welcome Back,${user.name}`,200) 
    } catch (error) {
        next(error)
    }
  
}


export const newUser = async(req,res)=>{
try {
    const {name , email, password} = req.body;

let user = await User.findOne({email})


if(user){
    return next(new ErrorHandler("User already exists",404))
   }

const hashedPassword = await bcrypt.hash(password,10)

user = await User.create({
    name : name,
    email :email,
    password: hashedPassword
})

// const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

// res.status(201).cookie("token",token,{
//     httpOnly:true,
//     maxAge :15*60*1000
// }).json({
//     success:true,
//     message:"registered succesfully"
// })

sendCookie(user,res,"Registered succesfully",201)
} catch (error) {
    next(error)
}


}

export const logoutUser = (req,res)=>{

   

    res.status(200).cookie("token","",{
    expires:new Date(Date.now()),
    sameSite:process.env.NODE_ENV === "Development" ?"lax" :"none",
    secure:process.env.NODE_ENV === "Development" ?false :true
}).json({
    success:true,
    message:"logged out succesfully"
})


}