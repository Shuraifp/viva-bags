import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import admin from "../firebase.js";


    //                    Admin

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({Id : user.id, role: user.role}, process.env.SECRET_KEY,{expiresIn : '1d'})
    const refreshToken = jwt.sign({Id : user.id, role: user.role}, process.env.SECRET_KEY,{expiresIn : '7d'})

    return res.status(200).json({ message: "Admin logged in successfully", accessToken, refreshToken, user });
  }catch(error){
    return res.status(500).json({message: error.message})
    console.log(error);
  }
}



//                      User


export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists || usernameExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
  });
    await newUser.save();
    const user = await User.findOne({ email });
    const accessToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '1d'})
    const refreshToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '7d'})
    return res.status(201).json({ message: "User registered successfully" , accessToken, refreshToken,
      user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage.path,
    }});
  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(401).json({ message: "User is blocked" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '1d'})
    const refreshToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '7d'})
    return res.status(200).json({ message: "User logged in successfully", accessToken, refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage.path,
      }
    });
  }catch(error){
    return res.status(500).json({message: error.message})
  }
}

let otpStore = {};
export const sendOtp = (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);

  otpStore[email] = {
    otp,
    expires: Date.now() + 60000, 
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  };
  console.log(otpStore)

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return res.status(500).json({ success: false, message: 'Error sending OTP', error:error.message });
  //   } else {
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  //   }
  // });
};

export const verifyOtp = (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
      return res.status(400).json({ success: false, message: 'OTP not requested' });
    }

    const storedOtp = otpStore[email];

    if (Date.now() > storedOtp.expires) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedOtp.otp === otp) {
      delete otpStore[email];
      next();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).json("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    console.log('firebase verified')
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
}

export const loginUserWithGoogle = async (req, res) => {
  const { uid, name, email, picture } = req.user;
  try {
    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });
    if(!user) {
    user = new User({ 
      googleId: uid, 
      username: name, 
      email,
      profileImage: {
        filename: picture,
        path: picture
      }
    });
  
  } else if(!user.googleId) {
    user.googleId = uid;
  }
  if (user.isBlocked) {
    return res.status(401).json({ message: "User is blocked" });
  }
  await user.save();
  const accessToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '1d'})
  const refreshToken = jwt.sign({Id : user.id, role: 'user'}, process.env.SECRET_KEY,{expiresIn : '7d'})
  return res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage.path,
    }});
  } catch (error) {
    return res.status(500).json({ message: "Error with logging in, try again" });
  }
};

