import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";


export const isUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  

  if (!token) return res.status(403).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if(decoded.role !== 'user') return res.status(401).json({ message: 'Invalid user token' });
    const user = await User.findById(decoded.Id).select('isBlocked');
    if(user.isBlocked) return res.status(401).json({ message: 'User is blocked' }); 
    req.user = decoded;
    console.log('token verified and continued..');
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Invalid token' });
  } 
};
export const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  

  if (!token) return res.status(403).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if(decoded.role !== 'admin') return res.status(401).json({ message: 'Invalid admin token' });
    req.user = decoded;
    console.log('token verified and continued..');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  } 
};


export const authenticateJWT = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  

  if (!token) return res.status(403).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if(decoded.role === 'admin') {
      const currentUser = await Admin.findById(decoded.Id).select('-password -__v');
      console.log('admin verified and continued..');
      return res.status(200).json({isAuthenticated : true, currentUser})
    } else {
      const currentUser = await User.findOne({ _id: decoded.Id }).select('-password -__v');
      console.log('user verified and continued..');
      return res.status(200).json({isAuthenticated : true, currentUser});
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token'+err });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.headers.authorization?.split(' ')[1];
  if (!refreshToken) return res.status(403).json({ message: 'No refresh token provided' });
  console.log('started refreshing token...');
  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const newAccessToken = jwt.sign({ Id: decoded.Id, role: decoded.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
    console.log('token refreshed');
    res.json({ newAccessToken});
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};
